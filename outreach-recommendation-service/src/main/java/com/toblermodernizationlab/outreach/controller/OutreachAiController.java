package com.toblermodernizationlab.outreach.controller;

import com.toblermodernizationlab.outreach.service.OutreachAiService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class OutreachAiController {

    private final OutreachAiService outreachAiService;

    public OutreachAiController(OutreachAiService outreachAiService) {
        this.outreachAiService = outreachAiService;
    }

    @PostMapping("/outreach-draft")
    public Map<String, String> generateDraft(
            @RequestBody Map<String, String> request) {

        String companyName = request.get("companyName");
        String targetMarket = request.get("targetMarket");

        String draft = outreachAiService.generateOutreachDraft(
                companyName,
                targetMarket
        );

        return Map.of("draft", draft);
    }
}