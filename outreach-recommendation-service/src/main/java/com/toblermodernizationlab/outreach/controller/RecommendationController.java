package com.toblermodernizationlab.outreach.controller;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.toblermodernizationlab.outreach.dto.RecommendationResponse;
import com.toblermodernizationlab.outreach.dto.CompanyRecommendationRequest;
import com.toblermodernizationlab.outreach.dto.CompanyRecommendationResponse;
import java.util.List;
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
    @PostMapping("/api/recommendations/companies")
    public CompanyRecommendationResponse rankCompanies(
        @RequestBody CompanyRecommendationRequest request) {
            // TML-41: API contract only
            // TML-42: Will implement scoring logic
            return new CompanyRecommendationResponse(
                request.campaignId(),
                List.of()
            );
        }
}