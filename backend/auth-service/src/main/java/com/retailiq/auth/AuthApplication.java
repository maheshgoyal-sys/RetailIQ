package com.retailiq.auth;

import com.retailiq.auth.model.User;
import com.retailiq.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class AuthApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByEmail("admin@retailiq.com")) {
                User admin = User.builder()
                        .username("admin")
                        .email("admin@retailiq.com")
                        .password(passwordEncoder.encode("admin123"))
                        .roles(List.of("ADMIN"))
                        .createdAt(LocalDateTime.now())
                        .build();
                userRepository.save(admin);
            }
        };
    }
}
