package com.sahayakai.controller;

import com.sahayakai.dto.ApiResponse;
import com.sahayakai.dto.ChatRequestDto;
import com.sahayakai.dto.ChatResponseDto;
import com.sahayakai.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "AI Chat Assistant", description = "AI conversational screener and support guidance endpoint")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    @Operation(summary = "Send a prompt to the AI Chatbot and receive guidance")
    public ResponseEntity<ApiResponse<ChatResponseDto>> chat(@Valid @RequestBody ChatRequestDto request) {
        ChatResponseDto response = chatService.processMessage(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
