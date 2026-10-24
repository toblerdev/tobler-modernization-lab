package com.toblermodernizationlab.outreach.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import com.toblermodernizationlab.outreach.dto.RecommendationResponse;

@RestController
public class RecommendationController {

    @GetMapping("/recommendations")
    public RecommendationResponse getRecommendations() {
        // Logic to fetch recommendations goes here
        return new RecommendationResponse(
            101L,
            "Send an introductory technical English email",
            "High"
        );
    }
}