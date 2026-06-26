package com.retailiq.campaign.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retailiq.campaign.model.Campaign;
import com.retailiq.campaign.service.CampaignService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping
    public ResponseEntity<List<Campaign>> getCampaigns(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        return ResponseEntity.ok(campaignService.getAllCampaigns(userId));
    }

    @PostMapping
    public ResponseEntity<Campaign> createCampaign(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestBody Campaign campaign) {
        return ResponseEntity.ok(campaignService.createCampaign(campaign, userId));
    }

    @PutMapping("/{id}/send")
    public ResponseEntity<Campaign> sendCampaign(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String id) {
        return ResponseEntity.ok(campaignService.sendCampaign(id, userId));
    }
}
