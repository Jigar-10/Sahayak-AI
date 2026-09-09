package com.sahayakai.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

public class ChatRequestDto {

    @NotBlank(message = "Message cannot be blank")
    private String message;

    private List<Map<String, String>> history;

    public ChatRequestDto() {
    }

    public ChatRequestDto(String message, List<Map<String, String>> history) {
        this.message = message;
        this.history = history;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<Map<String, String>> getHistory() {
        return history;
    }

    public void setHistory(List<Map<String, String>> history) {
        this.history = history;
    }
}
