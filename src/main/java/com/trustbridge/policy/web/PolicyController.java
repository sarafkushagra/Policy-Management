package com.trustbridge.policy.web;

import com.trustbridge.policy.domain.Policy;
import com.trustbridge.policy.domain.Product;
import com.trustbridge.policy.domain.User;
import com.trustbridge.policy.dto.BootstrapResponse;
import com.trustbridge.policy.dto.CreateClaimRequest;
import com.trustbridge.policy.dto.CreateProductRequest;
import com.trustbridge.policy.dto.PremiumRequest;
import com.trustbridge.policy.dto.PremiumResponse;
import com.trustbridge.policy.dto.PurchasePolicyRequest;
import com.trustbridge.policy.dto.PurchasePolicyResponse;
import com.trustbridge.policy.dto.RenewalSweepResponse;
import com.trustbridge.policy.dto.UpdateClaimRequest;
import com.trustbridge.policy.repository.InMemoryPolicyRepository;
import com.trustbridge.policy.service.ClaimService;
import com.trustbridge.policy.service.PdfCertificateService;
import com.trustbridge.policy.service.PolicyService;
import com.trustbridge.policy.service.PremiumService;
import com.trustbridge.policy.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class PolicyController {
    private final InMemoryPolicyRepository repository;
    private final PremiumService premiumService;
    private final PolicyService policyService;
    private final ClaimService claimService;
    private final ProductService productService;
    private final PdfCertificateService pdfCertificateService;

    public PolicyController(
            InMemoryPolicyRepository repository,
            PremiumService premiumService,
            PolicyService policyService,
            ClaimService claimService,
            ProductService productService,
            PdfCertificateService pdfCertificateService
    ) {
        this.repository = repository;
        this.premiumService = premiumService;
        this.policyService = policyService;
        this.claimService = claimService;
        this.productService = productService;
        this.pdfCertificateService = pdfCertificateService;
    }

    @GetMapping("/api/bootstrap")
    public BootstrapResponse bootstrap() {
        return new BootstrapResponse(repository.products(), repository.users(), repository.policies(),
                repository.claims(), repository.notifications());
    }

    @PostMapping("/api/premium")
    public PremiumResponse premium(@Valid @RequestBody PremiumRequest request) {
        Product product = repository.findProduct(request.productId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        return premiumService.calculate(product, request);
    }

    @PostMapping("/api/policies")
    public ResponseEntity<PurchasePolicyResponse> purchase(@Valid @RequestBody PurchasePolicyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(policyService.purchase(request));
    }

    @PostMapping("/api/claims")
    public ResponseEntity<?> createClaim(@Valid @RequestBody CreateClaimRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(claimService.create(request));
    }

    @PatchMapping("/api/claims/{claimId}")
    public ResponseEntity<?> updateClaim(@PathVariable String claimId, @Valid @RequestBody UpdateClaimRequest request) {
        return ResponseEntity.ok(claimService.update(claimId, request));
    }

    @PostMapping("/api/products")
    public ResponseEntity<?> createProduct(@Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
    }

    @PostMapping("/api/renewals/sweep")
    public RenewalSweepResponse renewalSweep() {
        int sent = policyService.runRenewalSweep();
        return new RenewalSweepResponse(sent, repository.notifications());
    }

    @GetMapping("/certificate/{policyId}")
    public ResponseEntity<byte[]> certificate(@PathVariable String policyId) {
        Policy policy = repository.findPolicy(policyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Policy not found"));
        Product product = repository.findProduct(policy.productId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        User user = repository.findUser(policy.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        byte[] pdf = pdfCertificateService.generate(policy, product, user);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline().filename(policy.policyNumber() + ".pdf").build().toString())
                .body(pdf);
    }
}
