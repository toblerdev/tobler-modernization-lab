package com.toblermodernizationlab.outreach.dto;

import java.time.LocalDate;

public record CompanyInput(
    Long companyId,
    String companyName,
    String targetGroup,
    boolean hasUsableContact,
    boolean hasOutreachHistory,
    LocalDate nextFollowUpDate
) {}
