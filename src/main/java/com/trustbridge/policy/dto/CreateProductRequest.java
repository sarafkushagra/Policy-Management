package com.trustbridge.policy.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record CreateProductRequest(
        @NotBlank String type,
        @NotBlank String name,
        String summary,
        @Min(1) int basePremium,
        @Min(100000) int coverage,
        List<String> benefits,
        @NotBlank String terms
) {
}
