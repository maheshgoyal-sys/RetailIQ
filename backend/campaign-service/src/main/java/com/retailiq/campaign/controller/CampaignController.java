package com.retailiq.campaign.controller;

import com.retailiq.campaign.model.Campaign;
import com.retailiq.campaign.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping
    public ResponseEntity<List<Campaign>> getCampaigns() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }

    @PostMapping
    public ResponseEntity<Campaign> createCampaign(@RequestBody Campaign campaign) {
        return ResponseEntity.ok(campaignService.createCampaign(campaign));
    }

    @PutMapping("/{id}/send")
    public ResponseEntity<Campaign> sendCampaign(@PathVariable String id) {
        return ResponseEntity.ok(campaignService.sendCampaign(id));
    }
}
