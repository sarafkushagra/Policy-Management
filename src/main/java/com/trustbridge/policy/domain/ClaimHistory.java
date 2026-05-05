package com.trustbridge.policy.domain;

import java.time.Instant;

public record ClaimHistory(ClaimStatus status, String by, Instant at, String notes) {
}
