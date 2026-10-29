
package com.toblermodernizationlab.outreach.service;

import com.toblermodernizationlab.outreach.dto.*;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Comparator;

@Service
public class RecommendationService {

    public RecommendationResponse getRecommendation() {

        return new RecommendationResponse(
            101L,
            "Send an introductory technical English email",
            "HIGH"
        );
    }

    public CompanyRecommendationResponse rankCompanies(
            CompanyRecommendationRequest request) {

        List<RankedCompany> recommendations = new ArrayList<>();

        for (CompanyInput company : request.companies()) {

            int score = 0;
            List<String> reasons = new ArrayList<>();

            for (ScoringRuleInput rule : request.rules()) {

                if (!rule.enabled()) {
                    continue;
                }

                if ("TARGET_MARKET_MATCH".equals(rule.code())) {

                    if (company.targetGroup() != null
                            && request.targetMarket() != null
                            && company.targetGroup().trim().equalsIgnoreCase(
                                    request.targetMarket().trim())) {

                        score += rule.weight();
                        reasons.add("Company matches campaign target market");
                    }
                }

                if ("CONTACT_AVAILABLE".equals(rule.code())) {
                    if (company.hasUsableContact()) {
                        score += rule.weight();
                        reasons.add("Company has a usable contact");
                    }
                }

                if ("NEVER_CONTACTED".equals(rule.code())) {
                    if (!company.hasOutreachHistory()) {
                        score += rule.weight();
                        reasons.add("Company has never been contacted");
                    }
                }
                
                if ("FOLLOWUP_OVERDUE".equals(rule.code())) {

                    if (company.nextFollowUpDate() != null &&
                        request.evaluationDate() != null &&
                        company.nextFollowUpDate().isBefore(request.evaluationDate())) {

                        score += rule.weight();

                        reasons.add("Company has an overdue follow-up");
                    }
                }

                if ("FOLLOWUP_DUE_TODAY".equals(rule.code())) {

                if (company.nextFollowUpDate() != null &&
                    request.evaluationDate() != null &&
                    company.nextFollowUpDate().isEqual(request.evaluationDate())) {

                    score += rule.weight();

                    reasons.add("Company has a follow-up due today");
                }
            }

            }

            recommendations.add(
                new RankedCompany(
                    company.companyId(),
                    company.companyName(),
                    score,
                    reasons
                )
            );
        }

        recommendations.sort(
            Comparator.comparingInt(RankedCompany::score).reversed()
        );

        return new CompanyRecommendationResponse(
            request.campaignId(),
            recommendations
        );
    }
}
