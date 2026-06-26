package com.retailiq.campaign.repository;

import com.retailiq.campaign.model.Campaign;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends MongoRepository<Campaign, String> {
    List<Campaign> findByUserId(String userId);

    @Query("{ '$or': [ { 'userId': 'guest' }, { 'userId': null }, { 'userId': { '$exists': false } } ] }")
    List<Campaign> findForGuest();
}
