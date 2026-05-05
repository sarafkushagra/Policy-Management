package com.trustbridge.policy.repository;

import com.trustbridge.policy.domain.Claim;
import com.trustbridge.policy.domain.Notification;
import com.trustbridge.policy.domain.Policy;
import com.trustbridge.policy.domain.PremiumMultipliers;
import com.trustbridge.policy.domain.Product;
import com.trustbridge.policy.domain.User;
import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryPolicyRepository {
    private final List<Product> products = new ArrayList<>();
    private final List<User> users = new ArrayList<>();
    private final List<Policy> policies = new ArrayList<>();
    private final List<Claim> claims = new ArrayList<>();
    private final List<Notification> notifications = new ArrayList<>();

    @PostConstruct
    void seed() {
        products.add(new Product(
                "prod-health-family",
                "Health",
                "Health Shield Family",
                "Cashless hospitalization with family floater coverage.",
                7200,
                500000,
                List.of("Cashless network hospitals", "Pre and post hospitalization", "Annual health checkup"),
                "1 year coverage. Waiting periods apply for specific conditions.",
                new PremiumMultipliers(0.018, 0.12, 0.000013)
        ));
        products.add(new Product(
                "prod-life-secure",
                "Life",
                "Life Secure Plus",
                "Term life cover with transparent risk-based pricing.",
                5400,
                1000000,
                List.of("High sum assured", "Nominee protection", "Tax-saving certificate"),
                "10 year renewable term plan. Medical declarations required.",
                new PremiumMultipliers(0.026, 0.18, 0.000006)
        ));
        products.add(new Product(
                "prod-vehicle-drive",
                "Vehicle",
                "Drive Guard Comprehensive",
                "Vehicle damage, third-party liability, and roadside support.",
                4100,
                350000,
                List.of("Own-damage cover", "Third-party liability", "Roadside assistance"),
                "1 year motor policy. Premium varies by vehicle age and claim history.",
                new PremiumMultipliers(0.012, 0.16, 0.000015)
        ));

        users.add(new User("user-customer", "Aarav Mehta", "aarav@example.com", "+91 98765 43210", "Policyholder"));
        users.add(new User("user-admin", "Nisha Rao", "admin@example.com", "+91 98765 11111", "Underwriter"));
        users.add(new User("user-adjuster", "Kabir Sen", "claims@example.com", "+91 98765 22222", "Claims Adjuster"));
    }

    public List<Product> products() {
        return products;
    }

    public List<User> users() {
        return users;
    }

    public List<Policy> policies() {
        return policies;
    }

    public List<Claim> claims() {
        return claims;
    }

    public List<Notification> notifications() {
        return notifications;
    }

    public Optional<Product> findProduct(String id) {
        return products.stream().filter(product -> product.id().equals(id)).findFirst();
    }

    public Optional<User> findUserByEmail(String email) {
        return users.stream().filter(user -> user.email().equalsIgnoreCase(email)).findFirst();
    }

    public Optional<User> findUser(String id) {
        return users.stream().filter(user -> user.id().equals(id)).findFirst();
    }

    public Optional<Policy> findPolicy(String id) {
        return policies.stream().filter(policy -> policy.id().equals(id)).findFirst();
    }

    public Optional<Claim> findClaim(String id) {
        return claims.stream().filter(claim -> claim.id().equals(id)).findFirst();
    }

    public void saveUser(User user) {
        users.add(user);
    }

    public void saveProduct(Product product) {
        products.add(product);
    }

    public void savePolicy(Policy policy) {
        policies.add(policy);
    }
    

    public void replacePolicy(Policy policy) {
        for (int index = 0; index < policies.size(); index += 1) {
            if (policies.get(index).id().equals(policy.id())) {
                policies.set(index, policy);
                return;
            }
        }
    }

    public void saveClaim(Claim claim) {
        claims.add(claim);
    }

    public void replaceClaim(Claim claim) {
        for (int index = 0; index < claims.size(); index += 1) {
            if (claims.get(index).id().equals(claim.id())) {
                claims.set(index, claim);
                return;
            }
        }
    }

    public void saveNotification(Notification notification) {
        notifications.add(notification);
    }
}
