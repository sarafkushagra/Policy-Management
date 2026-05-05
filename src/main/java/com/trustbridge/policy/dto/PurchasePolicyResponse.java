package com.trustbridge.policy.dto;

import com.trustbridge.policy.domain.Policy;
import com.trustbridge.policy.domain.User;

public record PurchasePolicyResponse(Policy policy, User user, String certificateUrl) {
}
