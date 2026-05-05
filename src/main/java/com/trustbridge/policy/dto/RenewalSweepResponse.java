package com.trustbridge.policy.dto;

import com.trustbridge.policy.domain.Notification;
import java.util.List;

public record RenewalSweepResponse(int sent, List<Notification> notifications) {
}
