package com.retailiq.segmentation.repository;

import com.retailiq.segmentation.model.Segment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SegmentRepository extends MongoRepository<Segment, String> {
    Optional<Segment> findBySegmentNameIgnoreCase(String segmentName);
    
    @Query("{ '$or': [ { 'userId': 'guest' }, { 'userId': null }, { 'userId': { '$exists': false } } ] }")
    List<Segment> findForGuest();
    
    List<Segment> findByUserId(String userId);
    
    void deleteByUserId(String userId);
    
    @Query(value = "{ '$or': [ { 'userId': 'guest' }, { 'userId': null }, { 'userId': { '$exists': false } } ] }", delete = true)
    void deleteForGuest();
}
