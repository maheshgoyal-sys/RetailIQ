package com.retailiq.auth.controller;

import com.retailiq.auth.model.User;
import com.retailiq.auth.repository.UserRepository;
import com.retailiq.auth.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for User Registration and Authentication")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    // DTO records for requests and responses
    public record RegisterRequest(String username, String email, String password, List<String> roles) {}
    public record LoginRequest(String email, String password) {}
    public record TokenResponse(String accessToken, String refreshToken, String username, String email, List<String> roles) {}
    public record RefreshTokenRequest(String refreshToken) {}
    public record RefreshTokenResponse(String accessToken, String refreshToken) {}

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is already taken!"));
        }
        if (userRepository.existsByUsername(request.username())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is already taken!"));
        }

        List<String> roles = request.roles();
        if (roles == null || roles.isEmpty()) {
            roles = List.of("MARKETER"); // Default role
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .roles(roles)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        return new ResponseEntity<>(Map.of("message", "User registered successfully!"), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT tokens")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.email());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.password(), userOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
        }

        User user = userOpt.get();
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getUsername(), user.getRoles());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return ResponseEntity.ok(new TokenResponse(
                accessToken,
                refreshToken,
                user.getUsername(),
                user.getEmail(),
                user.getRoles()
        ));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh an access token using a refresh token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        String token = request.refreshToken();
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired refresh token"));
        }

        String userId = jwtTokenProvider.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getUsername(), user.getRoles());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return ResponseEntity.ok(new RefreshTokenResponse(newAccessToken, newRefreshToken));
    }
}
