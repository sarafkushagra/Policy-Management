package com.trustbridge.policy.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {
    @GetMapping(value = {
            "/",
            "/about",
            "/testimonials",
            "/contact",
            "/login",
            "/products",
            "/purchase",
            "/claims",
            "/portal",
            "/portal/policyholder",
            "/portal/policyholder/dashboard",
            "/portal/policyholder/claims",
            "/portal/policyholder/purchase",
            "/portal/admin",
            "/portal/admin/dashboard",
            "/portal/admin/products",
            "/portal/admin/claims",
            "/portal/claims",
            "/portal/claims/dashboard"
    })
    public String forwardAppRoutes() {
        return "forward:/index.html";
    }
}
