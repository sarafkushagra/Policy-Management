package com.trustbridge.policy.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record Claim(
        String id,
        String claimNumber,
        String policyId,
        ClaimStatus status,
        LocalDate incidentDate,
        String description,
        int amount,
        ClaimEvidence evidence,
        List<ClaimHistory> history,
        Instant createdAt,
        String adjusterNotes,
        String payoutReference
) {
    public Claim transitionTo(ClaimStatus nextStatus, String by, String notes, String payoutReference) {
        history.add(new ClaimHistory(nextStatus, by, Instant.now(), notes == null ? "" : notes));
        return new Claim(id, claimNumber, policyId, nextStatus, incidentDate, description, amount, evidence,
                history, createdAt, notes == null ? adjusterNotes : notes, payoutReference);
    }
}
