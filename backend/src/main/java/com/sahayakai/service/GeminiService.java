package com.sahayakai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sahayakai.dto.ChatRequestDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.*;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String modelName;

    @Value("${gemini.api.base-url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String baseUrl;

    private static final String SYSTEM_INSTRUCTION = """
            You are Sahayak AI, a trauma-informed, empathetic, and highly knowledgeable legal, safety, and grievance redressal assistant for Indian citizens.
            
            Key Guidelines:
            1. EMPATHY & SAFETY: Maintain a calm, respectful, supportive, non-judgmental tone.
            2. CRISIS & DANGER: If the user indicates immediate physical violence, abuse, or life threat, immediately urge them to reach out to emergency numbers:
               - 112 (National Emergency)
               - 181 (Women Helpline)
               - 1098 (Childline)
               - 1930 (Cyber Crime)
            3. ACTIONABLE GUIDANCE: Provide structured steps for filing complaints (FIR, internal complaints committee / PoSH, cyber fraud reporting, legal aid under NALSA).
            4. ACCESSIBILITY: Keep responses concise, clear, well-formatted with markdown bullets.
            """;

    public GeminiService(RestTemplateBuilder restTemplateBuilder, ObjectMapper objectMapper) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(15))
                .build();
        this.objectMapper = objectMapper;
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty();
    }

    public Optional<String> generateChatReply(String userMessage, List<Map<String, String>> history) {
        if (!isConfigured()) {
            return Optional.empty();
        }

        try {
            String url = String.format("%s/%s:generateContent?key=%s", baseUrl, modelName.trim(), apiKey.trim());

            Map<String, Object> requestBody = new HashMap<>();

            // System instruction
            Map<String, Object> systemPart = Map.of("text", SYSTEM_INSTRUCTION);
            requestBody.put("systemInstruction", Map.of("parts", List.of(systemPart)));

            // Conversation history & current message
            List<Map<String, Object>> contents = new ArrayList<>();

            if (history != null) {
                for (Map<String, String> h : history) {
                    String content = h.get("content");
                    String role = h.get("role");
                    if (content != null && !content.trim().isEmpty()) {
                        String geminiRole = "assistant".equalsIgnoreCase(role) ? "model" : "user";
                        contents.add(Map.of(
                                "role", geminiRole,
                                "parts", List.of(Map.of("text", content.trim()))
                        ));
                    }
                }
            }

            contents.add(Map.of(
                    "role", "user",
                    "parts", List.of(Map.of("text", userMessage.trim()))
            ));
            requestBody.put("contents", contents);

            // Generation config
            Map<String, Object> genConfig = Map.of(
                    "temperature", 0.4,
                    "topP", 0.95,
                    "maxOutputTokens", 1000
            );
            requestBody.put("generationConfig", genConfig);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    JsonNode parts = candidates.get(0).path("content").path("parts");
                    if (parts.isArray() && !parts.isEmpty()) {
                        String text = parts.get(0).path("text").asText("");
                        if (!text.trim().isEmpty()) {
                            return Optional.of(text.trim());
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.warn("Google Gemini AI API call failed or timed out (falling back to rule-based engine): {}", e.getMessage());
        }

        return Optional.empty();
    }
}
