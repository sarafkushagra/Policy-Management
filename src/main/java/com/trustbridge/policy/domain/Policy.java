package com.trustbridge.policy.domain;

import java.time.Instant;
import java.time.LocalDate;

public record Policy(
        String id,
        String policyNumber,
        String userId,
        String productId,
        String status,
        String underwriterStatus,
        int annualPremium,
        int monthlyPremium,
        int coverage,
        int riskScore,
        int tenureYears,
        String paymentReference,
        KycDocument kyc,
        Instant createdAt,
        LocalDate startDate,
        LocalDate expiryDate,
        boolean renewalReminderSent
) {
    public Policy markReminderSent() {
        return new Policy(id, policyNumber, userId, productId, status, underwriterStatus, annualPremium,
                monthlyPremium, coverage, riskScore, tenureYears, paymentReference, kyc, createdAt,
                startDate, expiryDate, true);
    }
}
