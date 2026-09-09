package com.sahayakai.service;

import com.sahayakai.dto.ChatRequestDto;
import com.sahayakai.dto.ChatResponseDto;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChatService {

    private final GeminiService geminiService;

    public ChatService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public ChatResponseDto processMessage(ChatRequestDto request) {
        String lower = request.getMessage().trim().toLowerCase();

        // 1. Critical Safety First: Emergency Assistance & Immediate Danger (Always guaranteed response)
        if (lower.contains("emergency") || lower.contains("danger") || lower.contains("urgent") ||
                lower.contains("threat") || lower.contains("police") || lower.contains("ambulance") ||
                lower.contains("sos")) {

            Map<String, String> link = new HashMap<>();
            link.put("label", "Open Emergency Contacts");
            link.put("to", "/emergency");

            return new ChatResponseDto(
                    "**If you are in immediate physical danger, please reach out to emergency services right away.**\n\n" +
                            "• **112** — National Unified Emergency (Police, Fire, Medical)\n" +
                            "• **181** — Women Helpline (24/7 Support & Safety)\n" +
                            "• **1098** — Child Helpline (Child Protection & Care)\n" +
                            "• **1930** — Cyber Crime Helpline\n" +
                            "• **14566** — National Helpline Against Atrocities (SC/ST)\n\n" +
                            "You can view complete verified contact numbers on our Emergency page.",
                    Arrays.asList("View emergency numbers", "Start Safe Assessment", "I need help"),
                    link
            );
        }

        // 2. Google Gemini AI Generation (if configured and operational)
        if (geminiService.isConfigured()) {
            Optional<String> geminiReply = geminiService.generateChatReply(request.getMessage(), request.getHistory());
            if (geminiReply.isPresent()) {
                List<String> suggestions = deriveSuggestions(lower);
                Map<String, String> actionLink = deriveActionLink(lower);
                return new ChatResponseDto(geminiReply.get(), suggestions, actionLink);
            }
        }

        // 3. Fallback: Intelligent Domain-Aware Response Engine
        return generateRuleBasedResponse(lower);
    }

    private ChatResponseDto generateRuleBasedResponse(String lower) {
        // Tracking a complaint / case status
        if (lower.contains("track") || lower.contains("status") || lower.contains("my case") ||
                lower.contains("check case") || lower.contains("ticket")) {
            Map<String, String> link = new HashMap<>();
            link.put("label", "View My Cases");
            link.put("to", "/profile");

            return new ChatResponseDto(
                    "When an assessment is completed and submitted for review, a unique identifier is generated (for example, **CASE-2026-00125**).\n\n" +
                            "• You can track all your submitted complaints live on your **Profile / My Cases** page.\n" +
                            "• Support officers post official updates and notes as your grievance progresses through review.",
                    Arrays.asList("How do I file a complaint?", "Emergency assistance", "I need help"),
                    link
            );
        }

        // Filing a complaint / Starting an assessment
        if (lower.contains("file") || lower.contains("complaint") || lower.contains("start assessment") ||
                lower.contains("assessment") || lower.contains("report") || lower.contains("submit")) {

            Map<String, String> link = new HashMap<>();
            link.put("label", "Begin Safe Assessment");
            link.put("to", "/consent");

            return new ChatResponseDto(
                    "Filing a complaint or sharing your experience on Sahayak AI is **completely safe, confidential, and voluntary**.\n\n" +
                            "Here is how our 4-step process works:\n" +
                            "1. **Clear Consent First** — You learn exactly how your data is handled before anything begins.\n" +
                            "2. **Share Your Story** — Use text or voice, at your own pace, in your preferred language.\n" +
                            "3. **AI Screening** — Our trauma-informed system assesses the situation to identify the right support pathway.\n" +
                            "4. **Actionable Next Steps** — Receive personalized guidance, verified contacts, and option for human escalation.",
                    Arrays.asList("Start Safe Assessment", "Is my data private?", "Track my complaint"),
                    link
            );
        }

        // "I need help" / General distress & support
        if (lower.contains("need help") || lower.contains("help me") || lower.contains("sad") ||
                lower.contains("afraid") || lower.contains("worried") || lower.contains("anxious") ||
                lower.contains("scared") || lower.contains("support")) {

            Map<String, String> link = new HashMap<>();
            link.put("label", "Explore Support Resources");
            link.put("to", "/support");

            return new ChatResponseDto(
                    "Thank you for reaching out. It takes courage to seek support, and you are not alone.\n\n" +
                            "Sahayak AI is here to provide a calm, pressure-free space. Here are a few ways we can help right now:\n\n" +
                            "• **Take the Safe Assessment**: Share what you are going through to receive tailored recommendations.\n" +
                            "• **Emergency Resources**: Access 24/7 dedicated helplines for women, children, and urgent medical needs.\n" +
                            "• **Ask me any questions**: I can help you understand your rights, available options, or support centers.\n\n" +
                            "Take a breath — you can take this one step at a time.",
                    Arrays.asList("How do I file a complaint?", "Emergency assistance", "Is my data private?"),
                    link
            );
        }

        // Default thoughtful response
        return new ChatResponseDto(
                "Hello! 👋 I'm here to assist you with confidential support, filing a grievance, or finding emergency services.\n\n" +
                        "Sahayak AI is designed to help you navigate challenging situations with clear, trauma-informed guidance. " +
                        "You can start a confidential assessment, browse emergency contacts, or ask me for specific instructions.",
                Arrays.asList("I need help", "Emergency assistance", "How do I file a complaint?", "Track my complaint"),
                null
        );
    }

    private List<String> deriveSuggestions(String lower) {
        if (lower.contains("file") || lower.contains("complaint") || lower.contains("apply")) {
            return Arrays.asList("Start Safe Assessment", "How do I file a complaint?", "Track my complaint");
        }
        if (lower.contains("legal") || lower.contains("rights") || lower.contains("fir") || lower.contains("police")) {
            return Arrays.asList("What are my legal rights?", "Free legal aid (NALSA)", "Emergency assistance");
        }
        return Arrays.asList("Start Safe Assessment", "I need help", "Emergency assistance", "Track my complaint");
    }

    private Map<String, String> deriveActionLink(String lower) {
        if (lower.contains("file") || lower.contains("apply") || lower.contains("assessment")) {
            Map<String, String> link = new HashMap<>();
            link.put("label", "Begin Safe Assessment");
            link.put("to", "/consent");
            return link;
        }
        if (lower.contains("track") || lower.contains("status") || lower.contains("my case")) {
            Map<String, String> link = new HashMap<>();
            link.put("label", "View My Cases");
            link.put("to", "/profile");
            return link;
        }
        return null;
    }
}

