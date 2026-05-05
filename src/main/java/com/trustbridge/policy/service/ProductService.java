package com.trustbridge.policy.service;

import com.trustbridge.policy.domain.PremiumMultipliers;
import com.trustbridge.policy.domain.Product;
import com.trustbridge.policy.dto.CreateProductRequest;
import com.trustbridge.policy.repository.InMemoryPolicyRepository;
import java.security.SecureRandom;
import java.util.HexFormat;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final InMemoryPolicyRepository repository;
    private final SecureRandom random = new SecureRandom();

    public ProductService(InMemoryPolicyRepository repository) {
        this.repository = repository;
    }

    public Product create(CreateProductRequest request) {
        Product product = new Product(
                "prod-" + token(4).toLowerCase(),
                request.type(),
                request.name(),
                request.summary() == null || request.summary().isBlank() ? "Custom insurance product"
                        : request.summary(),
                request.basePremium(),
                request.coverage(),
                request.benefits() == null || request.benefits().isEmpty() ? List.of("Configurable coverage")
                        : request.benefits(),
                request.terms(),
                new PremiumMultipliers(0.018, 0.14, 0.00001));
        repository.saveProduct(product);
        return product;
    }

    private String token(int byteCount) {
        byte[] bytes = new byte[byteCount];
        random.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }
}
