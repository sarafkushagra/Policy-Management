package com.trustbridge.policy.service;

import com.trustbridge.policy.domain.Claim;
import com.trustbridge.policy.domain.ClaimEvidence;
import com.trustbridge.policy.domain.ClaimHistory;
import com.trustbridge.policy.domain.ClaimStatus;
import com.trustbridge.policy.dto.CreateClaimRequest;
import com.trustbridge.policy.dto.UpdateClaimRequest;
import com.trustbridge.policy.repository.InMemoryPolicyRepository;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ClaimService {
    private static final Map<ClaimStatus, List<ClaimStatus>> TRANSITIONS = Map.of(
            ClaimStatus.Submitted, List.of(ClaimStatus.Verified, ClaimStatus.Rejected),
            ClaimStatus.Verified, List.of(ClaimStatus.Approved, ClaimStatus.Rejected),
            ClaimStatus.Approved, List.of(ClaimStatus.Disbursed),
            ClaimStatus.Rejected, List.of(),
            ClaimStatus.Disbursed, List.of());

    private final InMemoryPolicyRepository repository;
    private final SecureRandom random = new SecureRandom();

    public ClaimService(InMemoryPolicyRepository repository) {
        this.repository = repository;
    }

    public Claim create(CreateClaimRequest request) {
        repository.findPolicy(request.policyId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Policy not found"));
        Claim claim = new Claim(
                id("claim"),
                "CLM-" + java.time.Year.now().getValue() + "-" + token(3),
                request.policyId(),
                ClaimStatus.Submitted,
                request.incidentDate(),
                request.description(),
                request.amount(),
                new ClaimEvidence(sanitizeFileName(request.evidenceFileName()),
                        "cloudinary://mock/claims/" + sanitizeFileName(request.evidenceFileName())),
                new ArrayList<>(List.of(new ClaimHistory(ClaimStatus.Submitted, "Policyholder", Instant.now(), ""))),
                Instant.now(),
                "",
                null);
        repository.saveClaim(claim);
        return claim;
    }

    public Claim update(String claimId, UpdateClaimRequest request) {
        Claim claim = repository.findClaim(claimId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Claim not found"));
        if (!TRANSITIONS.get(claim.status()).contains(request.status())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Invalid transition from " + claim.status() + " to " + request.status());
        }
        String payoutReference = request.status() == ClaimStatus.Disbursed ? "SET-" + token(4)
                : claim.payoutReference();
        Claim updated = claim.transitionTo(
                request.status(),
                request.by() == null || request.by().isBlank() ? "Claims Adjuster" : request.by(),
                request.notes(),
                payoutReference);
        repository.replaceClaim(updated);
        return updated;
    }

    private String id(String prefix) {
        return prefix + "-" + token(4).toLowerCase();
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
