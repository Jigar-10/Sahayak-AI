package com.sahayakai.dto;

import java.util.List;
import java.util.Map;

public class ChatResponseDto {
    private String reply;
    private List<String> suggestions;
    private Map<String, String> actionLink;

    public ChatResponseDto() {
    }

    public ChatResponseDto(String reply, List<String> suggestions, Map<String, String> actionLink) {
        this.reply = reply;
        this.suggestions = suggestions;
        this.actionLink = actionLink;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public Map<String, String> getActionLink() {
        return actionLink;
    }

    public void setActionLink(Map<String, String> actionLink) {
        this.actionLink = actionLink;
    }
}
