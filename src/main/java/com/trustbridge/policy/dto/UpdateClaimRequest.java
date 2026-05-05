package com.trustbridge.policy.dto;

import com.trustbridge.policy.domain.ClaimStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateClaimRequest(@NotNull ClaimStatus status, String by, String notes) {
}
