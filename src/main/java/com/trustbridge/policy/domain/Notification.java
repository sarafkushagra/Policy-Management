package com.trustbridge.policy.domain;

import java.time.Instant;

public record Notification(String id, String type, String policyId, String message, String channel, Instant createdAt) {
}
