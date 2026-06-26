package com.retailiq.lead.listener;

import com.retailiq.lead.service.LeadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class SegmentationEventListener {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(SegmentationEventListener.class);

    private final LeadService leadService;

    @KafkaListener(topics = "segmentation-events", groupId = "lead-group")
    public void handleSegmentationCompleted(Map<String, Object> event) {
        log.info("Received segmentation-events Kafka message: {}", event);
        try {
            String eventType = (String) event.get("eventType");
            if ("SEGMENTATION_RUN_COMPLETED".equals(eventType)) {
                String userId = (String) event.getOrDefault("userId", "guest");
                log.info("Triggering automatic high-score lead generation due to segment updates for userId={}...", userId);
                Map<String, Object> result = leadService.generateLeadsJob(userId);
                log.info("Auto lead generation results: {}", result);
            }
        } catch (Exception e) {
            log.error("Error processing segmentation Kafka message: {}", e.getMessage());
        }
    }
}
