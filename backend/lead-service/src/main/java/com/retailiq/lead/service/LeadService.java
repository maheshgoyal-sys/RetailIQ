package com.retailiq.lead.service;

import com.retailiq.lead.model.Lead;
import com.retailiq.lead.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LeadService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(LeadService.class);

    private final LeadRepository leadRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${customer.service.url}")
    private String customerServiceUrl;

    @Value("${segmentation.service.url}")
    private String segmentationServiceUrl;

    // DTO helpers
    public static class CustomerDto {
        public String id;
        public String name;
        public String email;
        public double totalSpend;
        public int purchaseCount;
        public String segment;
    }

    public static class SegmentDto {
        public String id;
        public String segmentName;
        public List<String> customerIds;
    }

    public static class PaginatedCustomers {
        public List<CustomerDto> content;
    }

    public List<Lead> getLeads(String status, String segmentId) {
        if (status != null && !status.isEmpty() && segmentId != null && !segmentId.isEmpty()) {
            return leadRepository.findByStatusIgnoreCaseAndSegmentId(status, segmentId);
        } else if (status != null && !status.isEmpty()) {
            return leadRepository.findByStatusIgnoreCase(status);
        } else if (segmentId != null && !segmentId.isEmpty()) {
            return leadRepository.findBySegmentId(segmentId);
        } else {
            return leadRepository.findAll();
        }
    }

    public Lead updateLeadStatus(String id, String status) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Lead not found with ID: " + id));
        lead.setStatus(status.toUpperCase());
        return leadRepository.save(lead);
    }

    public Map<String, Object> generateLeadsJob() {
        log.info("Starting lead scoring & generation routine...");

        // 1. Fetch segments from segmentation-service
        List<SegmentDto> segments = new ArrayList<>();
        try {
            String url = segmentationServiceUrl + "/api/segments";
            ResponseEntity<List<SegmentDto>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<SegmentDto>>() {}
            );
            if (response.getBody() != null) {
                segments = response.getBody();
            }
        } catch (Exception e) {
            log.error("Failed to fetch segments from segmentation-service: {}", e.getMessage());
        }

        // 2. Fetch customers from customer-service to get their spending stats
        List<CustomerDto> customers = new ArrayList<>();
        try {
            String url = customerServiceUrl + "/api/customers?size=1000";
            ResponseEntity<PaginatedCustomers> response = restTemplate.getForEntity(url, PaginatedCustomers.class);
            if (response.getBody() != null && response.getBody().content != null) {
                customers = response.getBody().content;
            }
        } catch (Exception e) {
            log.error("Failed to fetch customers from customer-service: {}", e.getMessage());
        }

        if (customers.isEmpty()) {
            return Map.of("message", "No customers available for lead scoring");
        }

        // Index customers for quick access
        Map<String, CustomerDto> customerMap = new HashMap<>();
        for (CustomerDto c : customers) {
            customerMap.put(c.id, c);
        }

        int generatedCount = 0;
        List<Lead> newlyGeneratedLeads = new ArrayList<>();

        // 3. For high-performing segments (High value loyal, Regular buyers), score and generate leads
        for (SegmentDto seg : segments) {
            String segName = seg.segmentName.toLowerCase();
            // Focus lead generation on high-value clusters
            if (segName.contains("high") || segName.contains("loyal") || segName.contains("regular")) {
                if (seg.customerIds != null) {
                    for (String custId : seg.customerIds) {
                        CustomerDto c = customerMap.get(custId);
                        if (c != null) {
                            // Run Lead Scoring Heuristic (RFM derived score)
                            int score = calculateLeadScore(c);
                            
                            // Check if lead already exists to avoid duplicates
                            boolean exists = leadRepository.findAll().stream()
                                    .anyMatch(l -> l.getCustomerId().equals(c.id));

                            if (score >= 70 && !exists) {
                                Lead lead = Lead.builder()
                                        .customerId(c.id)
                                        .customerName(c.name)
                                        .email(c.email)
                                        .segmentId(seg.id)
                                        .segmentName(seg.segmentName)
                                        .leadScore(score)
                                        .status("NEW")
                                        .campaign(suggestCampaign(seg.segmentName))
                                        .createdAt(LocalDateTime.now())
                                        .build();

                                newlyGeneratedLeads.add(leadRepository.save(lead));
                                generatedCount++;
                            }
                        }
                    }
                }
            }
        }

        return Map.of(
                "message", "Lead generation and scoring pipeline completed!",
                "leadsGenerated", generatedCount,
                "timestamp", LocalDateTime.now()
        );
    }

    private int calculateLeadScore(CustomerDto c) {
        // High spend and high count = maximum score
        double spendWeight = c.totalSpend / 300;  // Up to 50 pts
        double frequencyWeight = c.purchaseCount * 2.5; // Up to 50 pts
        int score = (int) (spendWeight + frequencyWeight);
        return Math.min(100, Math.max(0, score));
    }

    private String suggestCampaign(String segmentName) {
        if (segmentName.toLowerCase().contains("high")) {
            return "Diwali VIP Offer";
        } else if (segmentName.toLowerCase().contains("regular")) {
            return "Loyalty Bonus";
        }
        return "General Discount";
    }
}
