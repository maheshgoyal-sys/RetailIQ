package com.retailiq.campaign.repository;

import com.retailiq.campaign.model.Campaign;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampaignRepository extends MongoRepository<Campaign, String> {
}
