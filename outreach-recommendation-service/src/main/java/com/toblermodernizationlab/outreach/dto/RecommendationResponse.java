package com.toblermodernizationlab.outreach.dto;

public record RecommendationResponse(
    Long companyId,
    String recommendation,
    String priority
) {}
