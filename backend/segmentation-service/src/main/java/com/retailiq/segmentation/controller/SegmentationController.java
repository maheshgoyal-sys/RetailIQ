package com.retailiq.segmentation.controller;

import com.retailiq.segmentation.model.Segment;
import com.retailiq.segmentation.service.SegmentationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/segments")
@RequiredArgsConstructor
public class SegmentationController {

    private final SegmentationService segmentationService;

    @GetMapping
    public ResponseEntity<List<Segment>> getSegments(@RequestHeader(value = "X-User-Id", required = false) String userId) {
        return ResponseEntity.ok(segmentationService.getAllSegments(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Segment> getSegmentById(@PathVariable String id) {
        return segmentationService.getSegmentById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new NoSuchElementException("Segment not found with id: " + id));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@RequestHeader(value = "X-User-Id", required = false) String userId) {
        return ResponseEntity.ok(segmentationService.getSegmentsSummary(userId));
    }

    @PostMapping("/run")
    public ResponseEntity<Map<String, Object>> runSegmentation(@RequestHeader(value = "X-User-Id", required = false) String userId) {
        return ResponseEntity.ok(segmentationService.runSegmentationJob(userId));
    }
}
