package com.retailiq.customer.service;

import com.retailiq.customer.model.Customer;
import com.retailiq.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(CustomerService.class);

    private final CustomerRepository customerRepository;
    private final MongoTemplate mongoTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC = "customer-events";

    public Page<Customer> getCustomers(String city, String gender, String search, Pageable pageable) {
        Query query = new Query().with(pageable);
        List<Criteria> criteriaList = new ArrayList<>();

        if (city != null && !city.trim().isEmpty()) {
            criteriaList.add(Criteria.where("city").regex("^" + city.trim() + "$", "i"));
        }
        if (gender != null && !gender.trim().isEmpty()) {
            criteriaList.add(Criteria.where("gender").regex("^" + gender.trim() + "$", "i"));
        }
        if (search != null && !search.trim().isEmpty()) {
            Criteria searchCriteria = new Criteria().orOperator(
                    Criteria.where("name").regex(search.trim(), "i"),
                    Criteria.where("email").regex(search.trim(), "i")
            );
            criteriaList.add(searchCriteria);
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Customer.class);
        List<Customer> list = mongoTemplate.find(query, Customer.class);

        return new PageImpl<>(list, pageable, total);
    }

    public Customer createCustomer(Customer customer) {
        if (customer.getRegistrationDate() == null) {
            customer.setRegistrationDate(LocalDate.now());
        }
        Customer saved = customerRepository.save(customer);
        sendKafkaEvent("CUSTOMER_CREATED", saved);
        return saved;
    }

    public Optional<Customer> getCustomerById(String id) {
        return customerRepository.findById(id);
    }

    public Customer updateCustomer(String id, Customer updated) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Customer not found with id: " + id));

        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setAge(updated.getAge());
        existing.setGender(updated.getGender());
        existing.setCity(updated.getCity());
        existing.setTotalSpend(updated.getTotalSpend());
        existing.setPurchaseCount(updated.getPurchaseCount());
        existing.setLastPurchaseDate(updated.getLastPurchaseDate());
        existing.setProductCategories(updated.getProductCategories());
        existing.setSegment(updated.getSegment());

        Customer saved = customerRepository.save(existing);
        sendKafkaEvent("CUSTOMER_UPDATED", saved);
        return saved;
    }

    public void deleteCustomer(String id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Customer not found with id: " + id));
        customerRepository.deleteById(id);
        sendKafkaEvent("CUSTOMER_DELETED", Map.of("id", id, "email", customer.getEmail()));
    }

    public int importCustomersCsv(MultipartFile file) {
        int count = 0;
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {

            List<Customer> batchList = new ArrayList<>();
            Iterable<CSVRecord> csvRecords = csvParser.getRecords();

            for (CSVRecord csvRecord : csvRecords) {
                try {
                    String name = csvRecord.get("name");
                    String email = csvRecord.get("email");
                    String phone = csvRecord.get("phone");
                    int age = Integer.parseInt(csvRecord.get("age"));
                    String gender = csvRecord.get("gender");
                    String city = csvRecord.get("city");
                    double totalSpend = Double.parseDouble(csvRecord.get("totalSpend"));
                    int purchaseCount = Integer.parseInt(csvRecord.get("purchaseCount"));
                    
                    LocalDate lastPurchaseDate = LocalDate.parse(csvRecord.get("lastPurchaseDate"), dateFormatter);
                    
                    String categoriesRaw = csvRecord.get("productCategories");
                    List<String> productCategories = categoriesRaw != null && !categoriesRaw.isEmpty()
                            ? Arrays.asList(categoriesRaw.split(","))
                            : new ArrayList<>();

                    LocalDate registrationDate = LocalDate.now();
                    if (csvRecord.isMapped("registrationDate") && !csvRecord.get("registrationDate").isEmpty()) {
                        registrationDate = LocalDate.parse(csvRecord.get("registrationDate"), dateFormatter);
                    }

                    String segment = csvRecord.isMapped("segment") ? csvRecord.get("segment") : "New Customer";

                    Customer customer = Customer.builder()
                            .name(name)
                            .email(email)
                            .phone(phone)
                            .age(age)
                            .gender(gender)
                            .city(city)
                            .totalSpend(totalSpend)
                            .purchaseCount(purchaseCount)
                            .lastPurchaseDate(lastPurchaseDate)
                            .productCategories(productCategories)
                            .registrationDate(registrationDate)
                            .segment(segment)
                            .build();

                    batchList.add(customer);
                    count++;
                } catch (Exception e) {
                    log.error("Error parsing CSV row {}: {}", csvRecord.getRecordNumber(), e.getMessage());
                }
            }

            if (!batchList.isEmpty()) {
                customerRepository.saveAll(batchList);
                log.info("Successfully imported {} customers from CSV.", batchList.size());
                
                // Trigger Kafka notifications or general updates
                for (Customer c : batchList) {
                    sendKafkaEvent("CUSTOMER_CREATED", c);
                }
            }

        } catch (Exception e) {
            log.error("Failed to parse CSV file: {}", e.getMessage());
            throw new RuntimeException("Failed to parse CSV file: " + e.getMessage());
        }
        return count;
    }

    private void sendKafkaEvent(String eventType, Object data) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", eventType);
            event.put("timestamp", System.currentTimeMillis());
            event.put("data", data);
            
            kafkaTemplate.send(TOPIC, event);
            log.info("Sent Kafka event: {} for topic: {}", eventType, TOPIC);
        } catch (Exception e) {
            log.error("Failed to send Kafka event: {}", e.getMessage());
        }
    }
}
