package com.trustbridge.policy.service;

import com.trustbridge.policy.domain.KycDocument;
import com.trustbridge.policy.domain.Notification;
import com.trustbridge.policy.domain.Policy;
import com.trustbridge.policy.domain.Product;
import com.trustbridge.policy.domain.User;
import com.trustbridge.policy.dto.PremiumRequest;
import com.trustbridge.policy.dto.PremiumResponse;
import com.trustbridge.policy.dto.PurchasePolicyRequest;
import com.trustbridge.policy.dto.PurchasePolicyResponse;
import com.trustbridge.policy.repository.InMemoryPolicyRepository;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HexFormat;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PolicyService {
    private final InMemoryPolicyRepository repository;
    private final PremiumService premiumService;
    private final SecureRandom random = new SecureRandom();

    public PolicyService(InMemoryPolicyRepository repository, PremiumService premiumService) {
        this.repository = repository;
        this.premiumService = premiumService;
    }

    public PurchasePolicyResponse purchase(PurchasePolicyRequest request) {
        Product product = repository.findProduct(request.productId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        User user = repository.findUserByEmail(request.email()).orElseGet(() -> {
            User created = new User(id("user"), request.name(), request.email(), request.phone(), "Policyholder");
            repository.saveUser(created);
            return created;
        });

        PremiumResponse quote = premiumService.calculate(product, new PremiumRequest(
                request.productId(),
                request.age(),
                request.coverage(),
                request.riskScore(),
                request.priorClaims(),
                request.tenureYears()));

        LocalDate startDate = LocalDate.now();
        Policy policy = new Policy(
                id("policy"),
                policyNumber(),
                user.id(),
                product.id(),
                "Issued",
                request.riskScore() >= 3 ? "Manual Review Complete" : "Auto Approved",
                quote.annualPremium(),
                quote.monthlyPremium(),
                quote.coverage(),
                request.riskScore(),
                request.tenureYears(),
                "PAY-" + token(4),
                new KycDocument(request.kycType(), sanitizeFileName(request.kycFileName()),
                        "cloudinary://mock/kyc/" + sanitizeFileName(request.kycFileName())),
                Instant.now(),
                startDate,
                startDate.plusYears(request.tenureYears()),
                false);

        repository.savePolicy(policy);
        repository.saveNotification(new Notification(
                id("note"),
                "Policy Issued",
                policy.id(),
                policy.policyNumber() + " issued for " + user.name() + ". Certificate generated automatically.",
                "system",
                Instant.now()));
        return new PurchasePolicyResponse(policy, user, "/certificate/" + policy.id());
    }

    public int runRenewalSweep() {
        LocalDate today = LocalDate.now();
        int sent = 0;
        for (Policy policy : repository.policies()) {
            boolean inWindow = !policy.expiryDate().isBefore(today) && !policy.expiryDate().isAfter(today.plusDays(30));
            if (inWindow && !policy.renewalReminderSent()) {
                repository.replacePolicy(policy.markReminderSent());
                repository.saveNotification(new Notification(
                        id("note"),
                        "Renewal Reminder",
                        policy.id(),
                        "Renewal reminder sent for " + policy.policyNumber() + ", expiring on " + policy.expiryDate()
                                + ".",
                        "email/sms",
                        Instant.now()));
                sent += 1;
            }
        }
        return sent;
    }

    public String id(String prefix) {
        return prefix + "-" + token(4).toLowerCase();
    }

    private String policyNumber() {
        LocalDate today = LocalDate.now();
        return "POL-" + today.getYear() + String.format("%02d", today.getMonthValue()) + "-" + token(3);
    }

    private String token(int byteCount) {
        byte[] bytes = new byte[byteCount];
        random.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes).toUpperCase();
    }

    private String sanitizeFileName(String name) {
        return name == null ? "document" : name.replaceAll("[^a-zA-Z0-9_.-]", "_");
    }
}
