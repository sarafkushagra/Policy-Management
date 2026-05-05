package com.trustbridge.policy.dto;

import com.trustbridge.policy.domain.User;

public record AuthResponse(String token, User user) {
}