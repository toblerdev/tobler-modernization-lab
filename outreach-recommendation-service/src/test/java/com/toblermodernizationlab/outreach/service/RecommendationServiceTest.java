package com.toblermodernizationlab.outreach.service;

import com.toblermodernizationlab.outreach.dto.CompanyInput;
import com.toblermodernizationlab.outreach.dto.CompanyRecommendationRequest;
import com.toblermodernizationlab.outreach.dto.CompanyRecommendationResponse;
import com.toblermodernizationlab.outreach.dto.ScoringRuleInput;

import com.toblermodernizationlab.outreach.service.RecommendationService;

import com.toblermodernizationlab.outreach.dto.RankedCompany;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;
import java.util.List;
import java.util.Comparator;

class RecommendationServiceTest {

    private final RecommendationService service =
            new RecommendationService();

    @Test
    void shouldAwardPointWhenTargetMarketMatches() {

        ScoringRuleInput rule = new ScoringRuleInput(
            "TARGET_MARKET_MATCH",
            25,
            true
        );

        CompanyInput company = new CompanyInput(
            101L,
            "Example Machine Tools",
            "CNC",
            true,
            false,
            null
        );

        CompanyRecommendationRequest request = new CompanyRecommendationRequest(
            1L,
            "CNC",
            LocalDate.of(2026, 10, 28),
            List.of(rule),
            List.of(company)
        );

        CompanyRecommendationResponse response = service.rankCompanies(request);

        assertEquals(1L, response.campaignId());
        assertEquals(1, response.recommendations().size());
        assertEquals(25, response.recommendations().get(0).score());
    }

    @Test
    void shouldAccumulatePointsForMultipleMatchingRules() {

    List<ScoringRuleInput> rules = List.of(
        new ScoringRuleInput("TARGET_MARKET_MATCH", 25, true),
        new ScoringRuleInput("CONTACT_AVAILABLE", 15, true)
    );

    CompanyInput company = new CompanyInput(
        101L,
        "Example Machine Tools",
        "CNC",
        true,
        false,
        null
    );

    CompanyRecommendationRequest request =
        new CompanyRecommendationRequest(
            1L,
            "CNC",
            LocalDate.of(2026, 10, 28),
            rules,
            List.of(company)
        );

    CompanyRecommendationResponse response =
        service.rankCompanies(request);

    assertEquals(1, response.recommendations().size());
    assertEquals(40, response.recommendations().get(0).score());
    assertEquals(2, response.recommendations().get(0).reasons().size());
    }


    @Test
    void shouldAwardPointsWhenCompanyHasNeverBeenContacted() {

        ScoringRuleInput rule = new ScoringRuleInput(
            "NEVER_CONTACTED",
            20,
            true
        );

        CompanyInput company = new CompanyInput(
            102L,
            "Example Precision Manufacturing",
            "Precision",
            true,
            false,
            null
        );

        CompanyRecommendationRequest request =
            new CompanyRecommendationRequest(
                1L,
                "CNC",
                LocalDate.of(2026, 10, 29),
                List.of(rule),
                List.of(company)
            );

        CompanyRecommendationResponse response =
            service.rankCompanies(request);

        assertEquals(20, response.recommendations().get(0).score());
        assertEquals(1, response.recommendations().get(0).reasons().size());
    }

    @Test
    void shouldAwardPointsWhenFollowUpIsOverdue() {

        // Arrange
        LocalDate evaluationDate = LocalDate.of(2026, 10, 29);
        LocalDate followUpDate = LocalDate.of(2026, 10, 27);

        ScoringRuleInput rule = new ScoringRuleInput(
            "FOLLOWUP_OVERDUE",
            25,
            true
        );

        CompanyInput company = new CompanyInput(
            101L,
            "Example Manufacturing",
            "Machine Tools/CNC",
            true,
            true,
            followUpDate
        );

        CompanyRecommendationRequest request =
            new CompanyRecommendationRequest(
                1L,
                "Machine Tools/CNC",
                evaluationDate,
                List.of(rule),
                List.of(company)
            );

        // Act
        CompanyRecommendationResponse response =
            service.rankCompanies(request);

        // Assert
        RankedCompany result = response.recommendations().get(0);

        assertEquals(25, result.score());
        assertEquals(1, result.reasons().size());
    }


    @Test
    void shouldNotAwardOverduePointsWhenFollowUpIsToday() {

        LocalDate evaluationDate = LocalDate.of(2026, 10, 29);

        ScoringRuleInput rule = new ScoringRuleInput(
            "FOLLOWUP_OVERDUE",
            25,
            true
        );

        CompanyInput company = new CompanyInput(
            101L,
            "Example Manufacturing",
            "Machine Tools/CNC",
            true,
            true,
            evaluationDate
        );

        CompanyRecommendationRequest request =
            new CompanyRecommendationRequest(
                1L,
                "Machine Tools/CNC",
                evaluationDate,
                List.of(rule),
                List.of(company)
            );

        CompanyRecommendationResponse response =
            service.rankCompanies(request);

        RankedCompany result = response.recommendations().get(0);

        assertEquals(0, result.score());
        assertEquals(0, result.reasons().size());
    }    

    @Test
    void shouldNotAwardOverduePointsWhenFollowUpDateIsNull() {

        LocalDate evaluationDate = LocalDate.of(2026, 10, 29);

        ScoringRuleInput rule = new ScoringRuleInput(
            "FOLLOWUP_OVERDUE",
            25,
            true
        );

        CompanyInput company = new CompanyInput(
            101L,
            "Example Manufacturing",
            "Machine Tools/CNC",
            true,
            true,
            null
        );

        CompanyRecommendationRequest request =
            new CompanyRecommendationRequest(
                1L,
                "Machine Tools/CNC",
                evaluationDate,
                List.of(rule),
                List.of(company)
            );

        CompanyRecommendationResponse response =
            service.rankCompanies(request);

        RankedCompany result = response.recommendations().get(0);

        assertEquals(0, result.score());
        assertEquals(0, result.reasons().size());
    }

    @Test
    void shouldAwardPointsWhenFollowUpIsDueToday() {

        LocalDate evaluationDate = LocalDate.of(2026, 10, 29);

        ScoringRuleInput rule = new ScoringRuleInput(
            "FOLLOWUP_DUE_TODAY",
            15,
            true
        );

        CompanyInput company = new CompanyInput(
            101L,
            "Example Manufacturing",
            "Machine Tools/CNC",
            true,
            true,
            evaluationDate
        );

        CompanyRecommendationRequest request =
            new CompanyRecommendationRequest(
                1L,
                "Machine Tools/CNC",
                evaluationDate,
                List.of(rule),
                List.of(company)
            );

        CompanyRecommendationResponse response =
            service.rankCompanies(request);

        RankedCompany result = response.recommendations().get(0);

        assertEquals(15, result.score());
        assertEquals(1, result.reasons().size());
    }

    @Test
    void shouldRankCompaniesByScoreDescending() {

        // Arrange
        ScoringRuleInput rule = new ScoringRuleInput(
            "CONTACT_AVAILABLE", 15, true
        );

        CompanyInput companyWithoutContact = new CompanyInput(
            101L, "ABC Manufacturing", "Machine Tools/CNC",
            false, true, null
        );

        CompanyInput companyWithContact = new CompanyInput(
            102L, "XYZ Automation", "Machine Tools/CNC",
            true, true, null
        );

        CompanyRecommendationRequest request =
            new CompanyRecommendationRequest(
                1L,
                "Machine Tools/CNC",
                LocalDate.of(2026, 10, 29),
                List.of(rule),
                List.of(companyWithoutContact, companyWithContact)
            );

        // Act
        CompanyRecommendationResponse response =
            service.rankCompanies(request);

        // Assert
        assertEquals(102L, response.recommendations().get(0).companyId());
        assertEquals(15, response.recommendations().get(0).score());

        assertEquals(101L, response.recommendations().get(1).companyId());
        assertEquals(0, response.recommendations().get(1).score());
    }

    @Test
    void shouldNotAwardPointsForDisabledRule() {

        ScoringRuleInput rule = new ScoringRuleInput(
            "CONTACT_AVAILABLE",
            15,
            false
        );

        CompanyInput company = new CompanyInput(
            101L,
            "ABC Manufacturing",
            "Machine Tools/CNC",
            true,
            false,
            null
        );

        CompanyRecommendationRequest request =
            new CompanyRecommendationRequest(
                1L,
                "Machine Tools/CNC",
                LocalDate.of(2026, 10, 29),
                List.of(rule),
                List.of(company)
            );

        CompanyRecommendationResponse response =
            service.rankCompanies(request);

        RankedCompany result = response.recommendations().get(0);

        assertEquals(0, result.score());
        assertEquals(0, result.reasons().size());
    }    

    @Test
    void shouldUseCampaignSpecificRuleWeight() {

        ScoringRuleInput rule = new ScoringRuleInput(
            "TARGET_MARKET_MATCH",
            40,
            true
        );

        CompanyInput company = new CompanyInput(
            101L,
            "ABC Manufacturing",
            "Machine Tools/CNC",
            true,
            false,
            null
        );

        CompanyRecommendationRequest request =
            new CompanyRecommendationRequest(
                1L,
                "Machine Tools/CNC",
                LocalDate.of(2026, 10, 29),
                List.of(rule),
                List.of(company)
            );

        CompanyRecommendationResponse response =
            service.rankCompanies(request);

        RankedCompany result = response.recommendations().get(0);

        assertEquals(40, result.score());
        assertEquals(1, result.reasons().size());
    }

    @Test
    void shouldPreserveOriginalOrderWhenScoresAreEqual() {

        ScoringRuleInput rule = new ScoringRuleInput(
            "CONTACT_AVAILABLE",
            15,
            true
        );

        CompanyInput firstCompany = new CompanyInput(
            101L,
            "ABC Manufacturing",
            "Machine Tools/CNC",
            true,
            false,
            null
        );

        CompanyInput secondCompany = new CompanyInput(
            102L,
            "XYZ Automation",
            "Machine Tools/CNC",
            true,
            false,
            null
        );

        CompanyRecommendationRequest request =
            new CompanyRecommendationRequest(
                1L,
                "Machine Tools/CNC",
                LocalDate.of(2026, 10, 29),
                List.of(rule),
                List.of(firstCompany, secondCompany)
            );

        CompanyRecommendationResponse response =
            service.rankCompanies(request);

        assertEquals(2, response.recommendations().size());

        assertEquals(101L, response.recommendations().get(0).companyId());
        assertEquals(102L, response.recommendations().get(1).companyId());

        assertEquals(15, response.recommendations().get(0).score());
        assertEquals(15, response.recommendations().get(1).score());
    }

}
