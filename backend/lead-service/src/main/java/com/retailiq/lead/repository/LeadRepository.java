package com.retailiq.lead.repository;

import com.retailiq.lead.model.Lead;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends MongoRepository<Lead, String> {
    List<Lead> findByStatusIgnoreCase(String status);
    List<Lead> findBySegmentId(String segmentId);
    List<Lead> findByStatusIgnoreCaseAndSegmentId(String status, String segmentId);
    List<Lead> findByUserId(String userId);
    List<Lead> findByUserIdAndStatusIgnoreCase(String userId, String status);
    List<Lead> findByUserIdAndSegmentId(String userId, String segmentId);
    List<Lead> findByUserIdAndStatusIgnoreCaseAndSegmentId(String userId, String status, String segmentId);
    
    @Query("{ '$or': [ { 'userId': 'guest' }, { 'userId': null }, { 'userId': { '$exists': false } } ] }")
    List<Lead> findForGuest();
    
    @Query("{ '$or': [ { 'userId': 'guest' }, { 'userId': null }, { 'userId': { '$exists': false } } ], 'status': { '$regex': ?0, '$options': 'i' } }")
    List<Lead> findForGuestByStatus(String status);
    
    @Query("{ '$or': [ { 'userId': 'guest' }, { 'userId': null }, { 'userId': { '$exists': false } } ], 'segmentId': ?0 }")
    List<Lead> findForGuestBySegmentId(String segmentId);
    
    @Query("{ '$or': [ { 'userId': 'guest' }, { 'userId': null }, { 'userId': { '$exists': false } } ], 'status': { '$regex': ?0, '$options': 'i' }, 'segmentId': ?1 }")
    List<Lead> findForGuestByStatusAndSegmentId(String status, String segmentId);
}
