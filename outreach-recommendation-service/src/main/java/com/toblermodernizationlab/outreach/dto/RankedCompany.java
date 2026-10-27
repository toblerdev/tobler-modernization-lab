package com.toblermodernizationlab.outreach.dto;

import java.util.List;

public record RankedCompany(
    Long companyId,
    String companyName,
    int score,
    List<String> reasons
) {}
