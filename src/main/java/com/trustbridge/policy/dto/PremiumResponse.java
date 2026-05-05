package com.trustbridge.policy.dto;

public record PremiumResponse(int annualPremium, int monthlyPremium, int coverage, PremiumFactors factors) {
}
