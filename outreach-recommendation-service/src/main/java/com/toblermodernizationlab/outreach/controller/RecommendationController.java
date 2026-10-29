package com.toblermodernizationlab.outreach.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.toblermodernizationlab.outreach.dto.RecommendationResponse;
import com.toblermodernizationlab.outreach.dto.CompanyRecommendationRequest;
import com.toblermodernizationlab.outreach.dto.CompanyRecommendationResponse;

import java.util.List;

import com.toblermodernizationlab.outreach.service.RecommendationService;

@RestController
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/recommendations")
    public RecommendationResponse getRecommendations() {
        // Logic to fetch recommendations goes here
        return new RecommendationResponse(
            101L,
            "Send an introductory technical English email",
            "High"
        );
    }
    @PostMapping("/api/recommendations/companies")
    public CompanyRecommendationResponse rankCompanies(
        @RequestBody CompanyRecommendationRequest request) {
            return recommendationService.rankCompanies(request);
        }
}