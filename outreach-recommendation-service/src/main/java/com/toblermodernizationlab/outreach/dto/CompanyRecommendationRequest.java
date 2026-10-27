package com.toblermodernizationlab.outreach.dto;

import java.time.LocalDate;
import java.util.List;

public record CompanyRecommendationRequest(
    Long campaignId,
    String targetMarket,
    LocalDate evaluationDate,
    List<ScoringRuleInput> rules,
    List<CompanyInput> companies
) {}
