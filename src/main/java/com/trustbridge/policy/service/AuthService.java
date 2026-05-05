package com.trustbridge.policy.service;

import com.trustbridge.policy.domain.User;
import com.trustbridge.policy.dto.AuthResponse;
import com.trustbridge.policy.dto.LoginRequest;
import com.trustbridge.policy.repository.InMemoryPolicyRepository;
import java.security.SecureRandom;
import java.util.HexFormat;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final InMemoryPolicyRepository repository;
    private final Map<String, String> tokens = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    public AuthService(InMemoryPolicyRepository repository) {
        this.repository = repository;
    }

    public AuthResponse login(LoginRequest request) {
        User user = repository.findUserByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!passwordFor(user.role()).equals(request.password())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        String token = token();
        tokens.put(token, user.id());
        return new AuthResponse(token, user);
    }

    public AuthResponse me(String authorization) {
        String token = authorization == null ? "" : authorization.replace("Bearer ", "");
        String userId = tokens.get(token);
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session expired");
        }
        User user = repository.findUser(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session expired"));
        return new AuthResponse(token, user);
    }

    private String passwordFor(String role) {
        if ("Underwriter".equals(role)) return "admin123";
        if ("Claims Adjuster".equals(role)) return "claims123";
        return "user123";
    }

    private String token() {
        byte[] bytes = new byte[24];
        random.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }
}