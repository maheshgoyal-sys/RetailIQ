package com.retailiq.customer.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "customers")
public class Customer {
    @Id
    private String id;
    private String name;
    private String email;
    private String phone;
    private int age;
    private String gender;
    private String city;
    private double totalSpend;
    private int purchaseCount;
    private LocalDate lastPurchaseDate;
    private List<String> productCategories;
    private LocalDate registrationDate;
    private String segment; // e.g., "High Value", "Loyal", "At Risk", "New Customer"
    private String userId;
}
