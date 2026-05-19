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
    public ResponseEntity<List<Segment>> getSegments() {
        return ResponseEntity.ok(segmentationService.getAllSegments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Segment> getSegmentById(@PathVariable String id) {
        return segmentationService.getSegmentById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new NoSuchElementException("Segment not found with id: " + id));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(segmentationService.getSegmentsSummary());
    }

    @PostMapping("/run")
    public ResponseEntity<Map<String, Object>> runSegmentation() {
        return ResponseEntity.ok(segmentationService.runSegmentationJob());
    }
}
