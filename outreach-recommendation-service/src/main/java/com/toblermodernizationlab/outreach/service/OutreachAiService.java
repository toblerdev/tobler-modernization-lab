package com.toblermodernizationlab.outreach.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class OutreachAiService {

    private final ChatClient chatClient;

    public OutreachAiService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String generateOutreachDraft(
            String companyName,
            String targetMarket) {

        String prompt = """
            Write a professional introductory outreach email.

            Company: %s
            Target market: %s

            The sender is Tobler Professional English Consulting,
            an English consulting service for businesses in Taiwan
            who want their staff to improve their English communication skills
            at tradeshows, in cross-cultural meetings, and in other professional settings
            where English is the primary language.

            Requirements:
            - Professional and friendly tone
            - Maximum 150 words
            - Focus on English communication skills in professional and technical settings
            - Do not invent facts about the company
            - Include a subject line
            - Return only the email draft
            """.formatted(companyName, targetMarket);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}