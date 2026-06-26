package com.retailiq.campaign.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "campaigns")
public class Campaign {
    @Id
    private String id;
    private String name;
    private String targetSegmentId;
    private String targetSegmentName;
    private String channel; // "EMAIL", "SMS", "PUSH"
    private String message;
    private String scheduledAt;
    private String status; // "SCHEDULED", "SENT"
    private int sentCount;
    private double openRate; // 0 to 100
    private LocalDateTime createdAt;
    private String userId;
}
