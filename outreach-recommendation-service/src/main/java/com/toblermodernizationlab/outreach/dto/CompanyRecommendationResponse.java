package com.toblermodernizationlab.outreach.dto;

import java.util.List;

public record CompanyRecommendationResponse(
    Long campaignId,
    List<RankedCompany> recommendations
) {}
