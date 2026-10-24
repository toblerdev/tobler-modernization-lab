package com.toblermodernizationlab.outreach.service;

import com.toblermodernizationlab.outreach.dto.RecommendationResponse;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

    public RecommendationResponse getRecommendation() {
        return new RecommendationResponse(
            101L,
            "Send an introductory technical English email",
            "HIGH"
        );
    }
}