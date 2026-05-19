package com.retailiq.lead.model;

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
@Document(collection = "leads")
public class Lead {
    @Id
    private String id;
    private String customerId;
    private String customerName;
    private String email;
    private String segmentId;
    private String segmentName;
    private int leadScore; // 0 to 100
    private String status; // "NEW", "CONTACTED", "CONVERTED", "REJECTED"
    private String campaign;
    private LocalDateTime createdAt;
}
