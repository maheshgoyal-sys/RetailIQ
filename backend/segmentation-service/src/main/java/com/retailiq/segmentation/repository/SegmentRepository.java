package com.retailiq.segmentation.repository;

import com.retailiq.segmentation.model.Segment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SegmentRepository extends MongoRepository<Segment, String> {
    Optional<Segment> findBySegmentNameIgnoreCase(String segmentName);
}
