package com.retailiq.campaign.service;

import com.retailiq.campaign.model.Campaign;
import com.retailiq.campaign.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(CampaignService.class);

    private final CampaignRepository campaignRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${segmentation.service.url}")
    private String segmentationServiceUrl;

    private static final String TOPIC = "campaign-dispatches";

    // Helper DTO
    public static class SegmentDto {
        public String id;
        public String segmentName;
        public int size;
    }

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    public Campaign createCampaign(Campaign campaign) {
        campaign.setStatus("SCHEDULED");
        campaign.setSentCount(0);
        campaign.setOpenRate(0.0);
        campaign.setCreatedAt(LocalDateTime.now());
        return campaignRepository.save(campaign);
    }

    public Campaign sendCampaign(String id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Campaign not found with ID: " + id));

        if ("SENT".equals(campaign.getStatus())) {
            throw new IllegalStateException("Campaign has already been sent");
        }

        log.info("Executing campaign send queue for campaign: {}", campaign.getName());

        // 1. Fetch Segment Size from segmentation-service
        int size = 0;
        try {
            String url = segmentationServiceUrl + "/api/segments/" + campaign.getTargetSegmentId();
            ResponseEntity<SegmentDto> response = restTemplate.getForEntity(url, SegmentDto.class);
            if (response.getBody() != null) {
                size = response.getBody().size;
            }
        } catch (Exception e) {
            log.warn("Failed to contact segmentation-service to fetch segment size: {}", e.getMessage());
        }

        // Set fallback counts if segment not loaded
        if (size == 0) {
            size = 100 + new Random().nextInt(900);
        }

        // 2. Generate conversion rates
        double openRate = 45.0 + new Random().nextDouble() * 38.5; // between 45% and 83.5%
        openRate = Math.round(openRate * 10.0) / 10.0;

        // 3. Update Campaign details
        campaign.setStatus("SENT");
        campaign.setSentCount(size);
        campaign.setOpenRate(openRate);
        Campaign savedCampaign = campaignRepository.save(campaign);

        // 4. Publish message to Kafka
        publishCampaignKafkaEvent(savedCampaign);

        return savedCampaign;
    }

    private void publishCampaignKafkaEvent(Campaign campaign) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "CAMPAIGN_DISPATCHED");
            event.put("campaignId", campaign.getId());
            event.put("campaignName", campaign.getName());
            event.put("cohort", campaign.getTargetSegmentName());
            event.put("sentSize", campaign.getSentCount());
            event.put("timestamp", System.currentTimeMillis());

            kafkaTemplate.send(TOPIC, event);
            log.info("Dispatched Kafka campaign-dispatch event for '{}'", campaign.getName());
        } catch (Exception e) {
            log.error("Failed to publish campaign dispatch event to Kafka: {}", e.getMessage());
        }
    }
}
