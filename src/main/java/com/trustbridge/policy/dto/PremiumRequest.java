package com.trustbridge.policy.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record PremiumRequest(
        @NotBlank String productId,
        @Min(18) int age,
        @Min(100000) int coverage,
        @Min(1) int riskScore,
        @Min(0) int priorClaims,
        @Min(1) int tenureYears
) {
}
