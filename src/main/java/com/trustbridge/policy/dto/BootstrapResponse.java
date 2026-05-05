package com.trustbridge.policy.dto;

import com.trustbridge.policy.domain.Claim;
import com.trustbridge.policy.domain.Notification;
import com.trustbridge.policy.domain.Policy;
import com.trustbridge.policy.domain.Product;
import com.trustbridge.policy.domain.User;
import java.util.List;

public record BootstrapResponse(
        List<Product> products,
        List<User> users,
        List<Policy> policies,
        List<Claim> claims,
        List<Notification> notifications
) {
}
