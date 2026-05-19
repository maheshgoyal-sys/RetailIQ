package com.retailiq.customer.repository;

import com.retailiq.customer.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {
    Page<Customer> findByCityIgnoreCase(String city, Pageable pageable);
    Page<Customer> findByGenderIgnoreCase(String gender, Pageable pageable);
    Page<Customer> findByCityIgnoreCaseAndGenderIgnoreCase(String city, String gender, Pageable pageable);
    List<Customer> findBySegment(String segment);
}
