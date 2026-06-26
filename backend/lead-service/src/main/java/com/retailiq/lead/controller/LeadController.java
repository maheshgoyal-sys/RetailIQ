package com.retailiq.lead.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.retailiq.lead.model.Lead;
import com.retailiq.lead.service.LeadService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<List<Lead>> getLeads(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String segmentId) {
        return ResponseEntity.ok(leadService.getLeads(userId, status, segmentId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Lead> updateLeadStatus(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || status.isEmpty()) {
            throw new IllegalArgumentException("Status field is required");
        }
        return ResponseEntity.ok(leadService.updateLeadStatus(id, status, userId));
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateLeads(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        return ResponseEntity.ok(leadService.generateLeadsJob(userId));
    }
}
