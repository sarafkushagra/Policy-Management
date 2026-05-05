package com.trustbridge.policy.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CreateClaimRequest(
        @NotBlank String policyId,
        @NotNull LocalDate incidentDate,
        @NotBlank String description,
        @Min(1000) int amount,
        @NotBlank String evidenceFileName
) {
}
