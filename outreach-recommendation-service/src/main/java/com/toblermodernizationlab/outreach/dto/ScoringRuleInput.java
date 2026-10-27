package com.toblermodernizationlab.outreach.dto;

public record ScoringRuleInput(
    String code,
    int weight,
    boolean enabled
) {}
