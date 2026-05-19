package com.retailiq.lead.controller;

import com.retailiq.lead.model.Lead;
import com.retailiq.lead.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<List<Lead>> getLeads(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String segmentId) {
        return ResponseEntity.ok(leadService.getLeads(status, segmentId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Lead> updateLeadStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || status.isEmpty()) {
            throw new IllegalArgumentException("Status field is required");
        }
        return ResponseEntity.ok(leadService.updateLeadStatus(id, status));
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateLeads() {
        return ResponseEntity.ok(leadService.generateLeadsJob());
    }
}
