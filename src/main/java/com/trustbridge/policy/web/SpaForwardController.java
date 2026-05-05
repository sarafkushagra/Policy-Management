package com.trustbridge.policy.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {
    @GetMapping(value = {
            "/products",
            "/purchase",
            "/dashboard",
            "/claims",
            "/admin"
    })
    public String forwardAppRoutes() {
        return "forward:/index.html";
    }
}
