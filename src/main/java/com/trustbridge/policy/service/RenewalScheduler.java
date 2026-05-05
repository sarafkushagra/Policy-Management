package com.trustbridge.policy.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class RenewalScheduler {
    private final PolicyService policyService;

    public RenewalScheduler(PolicyService policyService) {
        this.policyService = policyService;
    }

    @Scheduled(cron = "0 0 9 * * *")
    public void sendRenewalReminders() {
        policyService.runRenewalSweep();
    }
}
