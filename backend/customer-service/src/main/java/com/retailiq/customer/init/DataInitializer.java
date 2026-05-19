package com.retailiq.customer.init;

import com.retailiq.customer.model.Customer;
import com.retailiq.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DataInitializer.class);

    private final CustomerRepository customerRepository;

    private static final String[] FIRST_NAMES_MALE = {
            "Ravi", "Amit", "Suresh", "Deepak", "Rahul", "Vikram", "Rajesh", "Vijay", "Anil", "Sanjay",
            "Manoj", "Sunil", "Prakash", "Karan", "Arjun", "Aditya", "Rohan", "Siddharth", "Gaurav", "Abhishek"
    };

    private static final String[] FIRST_NAMES_FEMALE = {
            "Priya", "Neha", "Kavya", "Anita", "Sonia", "Meera", "Pooja", "Aarti", "Divya", "Anjali",
            "Shalini", "Ritu", "Preeti", "Kiran", "Nisha", "Swati", "Jyoti", "Aditi", "Richa", "Sapna"
    };

    private static final String[] LAST_NAMES = {
            "Kumar", "Sharma", "Singh", "Gupta", "Patel", "Reddy", "Joshi", "Mehta", "Verma", "Das",
            "Bose", "Nair", "Rao", "Joshi", "Iyer", "Choudhury", "Mishra", "Trivedi", "Pandey", "Sen"
    };

    private static final String[] CITIES = {
            "Delhi", "Mumbai", "Bangalore", "Pune", "Ahmedabad", "Hyderabad", "Jaipur", "Chennai", "Kolkata", "Lucknow", "Kochi"
    };

    private static final String[] CATEGORIES = {
            "Electronics", "Apparel", "Home Decor", "Beauty", "Sports", "Grocery", "Books", "Toys"
    };

    @Override
    public void run(String... args) throws Exception {
        if (customerRepository.count() == 0) {
            log.info("No customers found in MongoDB. Initializing 200 sample retail customers...");
            Random random = new Random();
            List<Customer> customers = new ArrayList<>();

            for (int i = 1; i <= 200; i++) {
                String gender = random.nextBoolean() ? "Male" : "Female";
                String firstName = gender.equals("Male") 
                        ? FIRST_NAMES_MALE[random.nextInt(FIRST_NAMES_MALE.length)]
                        : FIRST_NAMES_FEMALE[random.nextInt(FIRST_NAMES_FEMALE.length)];
                String lastName = LAST_NAMES[random.nextInt(LAST_NAMES.length)];
                String name = firstName + " " + lastName;
                
                String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + i + "@retailiq.com";
                String phone = "+91 " + (9000000000L + random.nextLong(1000000000L));
                int age = 18 + random.nextInt(63); // Ages 18 to 80
                String city = CITIES[random.nextInt(CITIES.length)];

                // Vary spend and purchase counts to build clear clusters
                double totalSpend;
                int purchaseCount;
                LocalDate lastPurchaseDate;
                String segment;

                int profileType = random.nextInt(100); // 0-99
                if (profileType < 15) {
                    // Profile A: High Value Loyal (15%)
                    totalSpend = 15000 + random.nextInt(35000); // Rs 15,000 - 50,000
                    purchaseCount = 12 + random.nextInt(18); // 12 - 30 purchases
                    lastPurchaseDate = LocalDate.now().minusDays(random.nextInt(15)); // Active (last 15 days)
                    segment = "High value loyal";
                } else if (profileType < 55) {
                    // Profile B: Regular Buyers (40%)
                    totalSpend = 4000 + random.nextInt(10000); // Rs 4,000 - 14,000
                    purchaseCount = 4 + random.nextInt(8); // 4 - 12 purchases
                    lastPurchaseDate = LocalDate.now().minusDays(random.nextInt(45)); // Active (last 45 days)
                    segment = "Regular buyers";
                } else if (profileType < 70) {
                    // Profile C: At-Risk (15%)
                    totalSpend = 3000 + random.nextInt(5000); // Rs 3,000 - 8,000
                    purchaseCount = 3 + random.nextInt(4); // 3 - 7 purchases
                    lastPurchaseDate = LocalDate.now().minusDays(50 + random.nextInt(35)); // 50 to 85 days ago
                    segment = "At-risk customers";
                } else if (profileType < 85) {
                    // Profile D: Dormant (15%)
                    totalSpend = 500 + random.nextInt(2500); // Low spends
                    purchaseCount = 1 + random.nextInt(2); // 1 - 2 purchases
                    lastPurchaseDate = LocalDate.now().minusDays(90 + random.nextInt(120)); // 90+ days ago
                    segment = "Dormant";
                } else {
                    // Profile E: New Customers (15%)
                    totalSpend = 200 + random.nextInt(1500);
                    purchaseCount = 1;
                    lastPurchaseDate = LocalDate.now().minusDays(random.nextInt(10)); // Very active (last 10 days)
                    segment = "New customers";
                }

                // Random categories
                List<String> categories = new ArrayList<>();
                int categoryNum = 1 + random.nextInt(3); // 1 to 3 categories
                for (int k = 0; k < categoryNum; k++) {
                    String cat = CATEGORIES[random.nextInt(CATEGORIES.length)];
                    if (!categories.contains(cat)) {
                        categories.add(cat);
                    }
                }

                LocalDate registrationDate = LocalDate.now().minusMonths(random.nextInt(18)).minusDays(random.nextInt(28));

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
                        .productCategories(categories)
                        .registrationDate(registrationDate)
                        .segment(segment)
                        .build();

                customers.add(customer);
            }

            customerRepository.saveAll(customers);
            log.info("Successfully seeded 200 sample retail customers into MongoDB!");
        } else {
            log.info("Customers collection already populated. Skipping initialization.");
        }
    }
}
