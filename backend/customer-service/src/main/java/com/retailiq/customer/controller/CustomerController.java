package com.retailiq.customer.controller;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.retailiq.customer.model.Customer;
import com.retailiq.customer.service.CustomerService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Tag(name = "Customer Management", description = "Endpoints for managing Retail Customers")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    @Operation(summary = "Get all customers with pagination, search, and filters")
    public ResponseEntity<Page<Customer>> getCustomers(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String segment,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "registrationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Customer> customers = customerService.getCustomers(userId, city, gender, search, segment, pageable);
        return ResponseEntity.ok(customers);
    }

    @PostMapping
    @Operation(summary = "Create a new customer")
    public ResponseEntity<Customer> createCustomer(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestBody Customer customer) {
        Customer created = customerService.createCustomer(customer, userId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer details by ID")
    public ResponseEntity<Customer> getCustomerById(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String id) {
        return customerService.getCustomerById(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update customer details")
    public ResponseEntity<Customer> updateCustomer(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String id,
            @RequestBody Customer customer) {
        Customer updated = customerService.updateCustomer(id, customer, userId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete customer by ID")
    public ResponseEntity<Map<String, String>> deleteCustomer(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String id) {
        customerService.deleteCustomer(id, userId);
        return ResponseEntity.ok(Map.of("message", "Customer successfully deleted"));
    }

    @PostMapping("/bulk-import")
    @Operation(summary = "Import customers in bulk via CSV upload")
    public ResponseEntity<Map<String, Object>> importCustomers(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Uploaded CSV file is empty"));
        }
        int count = customerService.importCustomersCsv(file, userId);
        return ResponseEntity.ok(Map.of(
                "message", "Successfully imported customers",
                "count", count
        ));
    }
}
