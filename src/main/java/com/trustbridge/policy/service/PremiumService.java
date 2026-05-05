package com.trustbridge.policy.service;

import com.trustbridge.policy.domain.Product;
import com.trustbridge.policy.dto.PremiumFactors;
import com.trustbridge.policy.dto.PremiumRequest;
import com.trustbridge.policy.dto.PremiumResponse;
import org.springframework.stereotype.Service;

@Service
public class PremiumService {
    public PremiumResponse calculate(Product product, PremiumRequest request) {
        int age = request.age();
        int coverage = request.coverage() == 0 ? product.coverage() : request.coverage();
        int riskScore = request.riskScore() == 0 ? 1 : request.riskScore();
        int priorClaims = request.priorClaims();
        int tenureYears = request.tenureYears() == 0 ? 1 : request.tenureYears();
        int coverageDelta = Math.max(0, coverage - product.coverage());

        double ageFactor = 1 + Math.max(0, age - 25) * product.multipliers().age();
        double riskFactor = 1 + riskScore * product.multipliers().risk() + priorClaims * 0.08;
        double coverageFactor = 1 + coverageDelta * product.multipliers().coverage();
        double tenureDiscount = tenureYears >= 3 ? 0.9 : tenureYears >= 2 ? 0.95 : 1;
        double rawPremium = product.basePremium() * ageFactor * riskFactor * coverageFactor * tenureYears
                * tenureDiscount;

        int annualPremium = (int) Math.round(rawPremium);
        return new PremiumResponse(
                annualPremium,
                (int) Math.round(annualPremium / 12.0),
                coverage,
                new PremiumFactors(round(ageFactor), round(riskFactor), round(coverageFactor), tenureDiscount));
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
