package com.toblermodernizationlab.outreach.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class RecommendationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldAcceptCompanyRecommendationRequest() throws Exception {

        String requestJson = """
            {
              "campaignId": 1,
              "targetMarket": "Machine Tools / CNC",
              "evaluationDate": "2026-10-27",
              "rules": [
                {
                  "code": "TARGET_MARKET_MATCH",
                  "weight": 25,
                  "enabled": true
                }
              ],
              "companies": [
                {
                  "companyId": 12,
                  "companyName": "Example CNC Manufacturing",
                  "targetGroup": "Machine Tools / CNC",
                  "hasUsableContact": true,
                  "hasOutreachHistory": false,
                  "nextFollowUpDate": null
                }
              ]
            }
            """;

        mockMvc.perform(post("/api/recommendations/companies")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.campaignId").value(1))
            .andExpect(jsonPath("$.recommendations").isArray())
            .andExpect(jsonPath("$.recommendations").isEmpty());
    }
}
