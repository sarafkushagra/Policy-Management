package com.trustbridge.policy.domain;

import java.util.List;

public record Product(
        String id,
        String type,
        String name,
        String summary,
        int basePremium,
        int coverage,
        List<String> benefits,
        String terms,
        PremiumMultipliers multipliers
) {
}
