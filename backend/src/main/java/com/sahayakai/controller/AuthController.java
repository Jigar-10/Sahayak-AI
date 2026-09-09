package com.sahayakai.controller;

import com.sahayakai.dto.ApiResponse;
import com.sahayakai.dto.AuthResponse;
import com.sahayakai.dto.LoginRequest;
import com.sahayakai.dto.RegisterRequest;
import com.sahayakai.dto.UserDto;
import com.sahayakai.security.UserPrincipal;
import com.sahayakai.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration, login, and identity endpoints")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and receive JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/owner-login")
    @Operation(summary = "Authenticate owner and verify staff/owner privileges")
    public ResponseEntity<ApiResponse<AuthResponse>> ownerLogin(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.ownerLogin(request);
        return ResponseEntity.ok(ApiResponse.success("Owner login successful", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        UserDto userDto = authService.getCurrentUser(currentUser);
        return ResponseEntity.ok(ApiResponse.success(userDto));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user and invalidate session")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }
}
