package com.retailiq.segmentation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "segments")
public class Segment {
    @Id
    private String id;
    private String segmentName; // "High Value", "Loyal", "At Risk", "New Customer", etc.
    private String description;
    private List<String> customerIds;
    private double avgSpend;
    private int size;
    private String topCategory;
    private LocalDateTime createdAt;
    private String userId;
}
