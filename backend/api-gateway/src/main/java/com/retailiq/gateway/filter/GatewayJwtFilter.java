package com.retailiq.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class GatewayJwtFilter implements GlobalFilter, Ordered {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(GatewayJwtFilter.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    private SecretKey key;

    @PostConstruct
    public void init() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
            this.key = Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            log.warn("Failed to decode secret as Base64 in Gateway. Falling back to plain bytes.");
            byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
            this.key = Keys.hmacShaKeyFor(keyBytes);
        }
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        // 1. Exclude public endpoints
        if (path.startsWith("/api/auth/") || 
            path.startsWith("/swagger-ui/") || 
            path.startsWith("/v3/api-docs") || 
            path.startsWith("/api-docs")) {
            return chain.filter(exchange);
        }

        // Allow preflight options requests
        if (request.getMethod().name().equalsIgnoreCase("OPTIONS")) {
            return chain.filter(exchange);
        }

        // 2. Extract Authorization Header
        if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
            log.warn("Missing Authorization Header for path: {}", path);
            return onError(exchange, "Missing Authorization Header", HttpStatus.UNAUTHORIZED);
        }

        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Invalid Authorization Header format for path: {}", path);
            return onError(exchange, "Invalid Authorization Header", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        // 3. Validate Token
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String userId = claims.getSubject();
            String username = claims.get("username", String.class);
            List<?> roles = claims.get("roles", List.class);

            // 4. Inject Headers Downstream
            ServerHttpRequest mutatedRequest = request.mutate()
                    .header("X-User-Id", userId)
                    .header("X-User-Name", username)
                    .header("X-User-Roles", roles != null ? roles.toString() : "[]")
                    .build();

            return chain.filter(exchange.mutate().request(mutatedRequest).build());

        } catch (Exception e) {
            log.error("JWT validation error for token on path {}: {}", path, e.getMessage());
            return onError(exchange, "JWT validation failed: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }

    @Override
    public int getOrder() {
        return -1; // Execute early in the filter chain
    }
}
