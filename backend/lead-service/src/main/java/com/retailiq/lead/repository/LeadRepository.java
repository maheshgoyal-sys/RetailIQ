package com.retailiq.lead.repository;

import com.retailiq.lead.model.Lead;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends MongoRepository<Lead, String> {
    List<Lead> findByStatusIgnoreCase(String status);
    List<Lead> findBySegmentId(String segmentId);
    List<Lead> findByStatusIgnoreCaseAndSegmentId(String status, String segmentId);
}
