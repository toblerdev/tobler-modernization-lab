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
            Write the email in two languages:
            1. Traditional Chinese (Taiwan Mandarin), presented first.
            2. English, presented immediately afterward.

            Both versions must communicate the same message and offer.
            Use natural, professional Taiwanese business language in the
            Traditional Chinese version.

            Company: %s
            Target market: %s

            The sender is Tobler Professional English Consulting,
            an English consulting service for businesses in Taiwan
            who want their staff to improve their English communication skills
            at tradeshows, in cross-cultural meetings, and in other professional settings
            where English is the primary language.
            Tobler Professional English Consulting offers a complimentary
            30-minute demonstration session to show how its training can
            help employees improve English communication in professional
            and technical settings.

            Include a polite invitation to schedule this demonstration.
            Do not invent client-specific facts, previous relationships,
            testimonials, or guaranteed results.

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