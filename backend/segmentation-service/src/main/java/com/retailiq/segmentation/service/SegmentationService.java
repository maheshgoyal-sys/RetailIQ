package com.retailiq.segmentation.service;

import com.retailiq.segmentation.model.Segment;
import com.retailiq.segmentation.repository.SegmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SegmentationService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(SegmentationService.class);

    private final SegmentRepository segmentRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    @Value("${customer.service.url}")
    private String customerServiceUrl;

    private static final String TOPIC = "segmentation-events";

    // Structure matching customer DTO received from customer-service
    public static class CustomerDto {
        public String id;
        public String name;
        public String email;
        public String phone;
        public int age;
        public String gender;
        public String city;
        public double totalSpend;
        public int purchaseCount;
        public String lastPurchaseDate;
        public List<String> productCategories;
        public String registrationDate;
        public String segment;
    }

    // Wrap paginated responses from customer-service
    public static class PaginatedCustomers {
        public List<CustomerDto> content;
    }

    public List<Segment> getAllSegments(String userId) {
        if (userId == null || userId.trim().isEmpty() || userId.equalsIgnoreCase("guest")) {
            return segmentRepository.findForGuest();
        }
        return segmentRepository.findByUserId(userId);
    }

    public Optional<Segment> getSegmentById(String id) {
        return segmentRepository.findById(id);
    }

    public Map<String, Object> getSegmentsSummary(String userId) {
        List<Segment> segments = getAllSegments(userId);
        long totalCustomers = 0;
        double sumAvgSpend = 0;

        for (Segment s : segments) {
            totalCustomers += s.getSize();
            sumAvgSpend += s.getAvgSpend();
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("segmentCount", segments.size());
        summary.put("totalCustomers", totalCustomers);
        summary.put("averageSpendOverall", segments.isEmpty() ? 0 : sumAvgSpend / segments.size());
        
        List<Map<String, Object>> list = new ArrayList<>();
        for (Segment s : segments) {
            list.add(Map.of(
                "name", s.getSegmentName(),
                "size", s.getSize(),
                "avgSpend", s.getAvgSpend()
            ));
        }
        summary.put("segments", list);

        return summary;
    }

    public Map<String, Object> runSegmentationJob(String userId) {
        log.info("Triggering customer segmentation job for userId={}...", userId);

        // 1. Fetch user-scoped customers from customer-service
        List<CustomerDto> customers = new ArrayList<>();
        try {
            String userIdParam = (userId == null || userId.trim().isEmpty() || userId.equalsIgnoreCase("guest"))
                    ? "guest" : userId;
            String url = customerServiceUrl + "/api/customers?size=1000";
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-User-Id", userIdParam);
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<PaginatedCustomers> response = restTemplate.exchange(url, HttpMethod.GET, entity, PaginatedCustomers.class);
            if (response.getBody() != null && response.getBody().content != null) {
                customers = response.getBody().content;
            }
            log.info("Fetched {} customers from customer-service for userId={}", customers.size(), userIdParam);
        } catch (Exception e) {
            log.error("Failed to fetch customers: {}", e.getMessage());
            throw new RuntimeException("Customer-service communication error: " + e.getMessage());
        }

        if (customers.isEmpty()) {
            return Map.of("message", "No customers found to segment");
        }

        // 2. Post customers to Python ML Service for clustering
        Map<String, String> mapping = new HashMap<>();
        try {
            String url = mlServiceUrl + "/ml/segment";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<List<CustomerDto>> request = new HttpEntity<>(customers, headers);

            ResponseEntity<Map<String, String>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    request,
                    new ParameterizedTypeReference<Map<String, String>>() {}
            );

            if (response.getBody() != null) {
                mapping = response.getBody();
            }
            log.info("Received K-Means segmentation labels for {} customers", mapping.size());
        } catch (Exception e) {
            log.warn("Failed to contact ML service. Utilizing fallback rule-based segmenter for development.");
            mapping = ruleBasedSegmenter(customers);
        }

        // 3. Update customer segments back to customer-service and group them
        Map<String, List<String>> segmentGroupedCustomerIds = new HashMap<>();
        Map<String, List<CustomerDto>> segmentGroupedCustomers = new HashMap<>();

        for (CustomerDto c : customers) {
            String segmentLabel = mapping.getOrDefault(c.id, "Regular buyers");
            c.segment = segmentLabel;

            segmentGroupedCustomerIds.computeIfAbsent(segmentLabel, k -> new ArrayList<>()).add(c.id);
            segmentGroupedCustomers.computeIfAbsent(segmentLabel, k -> new ArrayList<>()).add(c);

            // Update in customer-service via REST
            try {
                String updateUrl = customerServiceUrl + "/api/customers/" + c.id;
                HttpHeaders updateHeaders = new HttpHeaders();
                updateHeaders.setContentType(MediaType.APPLICATION_JSON);
                String userIdParam = (userId == null || userId.trim().isEmpty() || userId.equalsIgnoreCase("guest"))
                        ? "guest" : userId;
                updateHeaders.set("X-User-Id", userIdParam);
                HttpEntity<CustomerDto> updateEntity = new HttpEntity<>(c, updateHeaders);
                restTemplate.exchange(updateUrl, HttpMethod.PUT, updateEntity, Void.class);
            } catch (Exception e) {
                log.error("Failed to update customer segment in customer-service for ID {}: {}", c.id, e.getMessage());
            }
        }

        // 4. Recalculate segment stats and save to MongoDB (scoped to userId)
        final String effectiveUserId = (userId == null || userId.trim().isEmpty()) ? "guest" : userId;
        if (effectiveUserId.equalsIgnoreCase("guest")) {
            segmentRepository.deleteForGuest();
        } else {
            segmentRepository.deleteByUserId(effectiveUserId);
        }
        List<Segment> savedSegments = new ArrayList<>();

        for (Map.Entry<String, List<CustomerDto>> entry : segmentGroupedCustomers.entrySet()) {
            String segName = entry.getKey();
            List<CustomerDto> segCusts = entry.getValue();

            double totalSpend = 0;
            Map<String, Integer> categoryCounts = new HashMap<>();
            
            for (CustomerDto c : segCusts) {
                totalSpend += c.totalSpend;
                if (c.productCategories != null) {
                    for (String cat : c.productCategories) {
                        categoryCounts.put(cat, categoryCounts.getOrDefault(cat, 0) + 1);
                    }
                }
            }

            double avgSpend = segCusts.isEmpty() ? 0 : totalSpend / segCusts.size();
            String topCategory = categoryCounts.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse("General");

            String description = getDescriptionForSegment(segName);

            Segment segment = Segment.builder()
                    .segmentName(segName)
                    .description(description)
                    .customerIds(segmentGroupedCustomerIds.get(segName))
                    .avgSpend(Math.round(avgSpend))
                    .size(segCusts.size())
                    .topCategory(topCategory)
                    .createdAt(LocalDateTime.now())
                    .userId(effectiveUserId)
                    .build();

            savedSegments.add(segmentRepository.save(segment));
        }

        // 5. Emit Kafka Event to notify lead-service or campaign-service
        sendSegmentationKafkaEvent(effectiveUserId, savedSegments);

        return Map.of(
                "message", "Customer segmentation job completed successfully via ML Service!",
                "segmentsUpdated", savedSegments.size(),
                "timestamp", LocalDateTime.now()
        );
    }

    private Map<String, String> ruleBasedSegmenter(List<CustomerDto> customers) {
        Map<String, String> mapping = new HashMap<>();
        for (CustomerDto c : customers) {
            if (c.totalSpend >= 15000 && c.purchaseCount >= 12) {
                mapping.put(c.id, "High value loyal");
            } else if (c.totalSpend >= 4000 && c.purchaseCount >= 4) {
                mapping.put(c.id, "Regular buyers");
            } else if (c.purchaseCount <= 2 && c.totalSpend < 1500) {
                mapping.put(c.id, "New customers");
            } else {
                mapping.put(c.id, "At-risk customers");
            }
        }
        return mapping;
    }

    private String getDescriptionForSegment(String name) {
        switch (name.toLowerCase()) {
            case "high value loyal": return "Customers with premium purchase frequencies and exceptionally high basket spends.";
            case "regular buyers": return "Steady active buyers with moderate spending and consistent checkouts.";
            case "at-risk customers": return "Once valuable buyers who have not purchased in over 45-60 days.";
            case "dormant": return "Extremely inactive historical accounts with single purchase counts.";
            default: return "Recently registered shoppers undergoing initial activation.";
        }
    }

    private void sendSegmentationKafkaEvent(String userId, List<Segment> segments) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "SEGMENTATION_RUN_COMPLETED");
            event.put("timestamp", System.currentTimeMillis());
            event.put("userId", userId);
            event.put("segments", segments);

            kafkaTemplate.send(TOPIC, event);
            log.info("Dispatched Kafka event to topic '{}': SEGMENTATION_RUN_COMPLETED for userId={}", TOPIC, userId);
        } catch (Exception e) {
            log.error("Failed to dispatch Kafka event: {}", e.getMessage());
        }
    }
}
