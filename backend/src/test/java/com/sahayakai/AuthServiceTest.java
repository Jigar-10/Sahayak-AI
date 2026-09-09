package com.sahayakai;

import com.sahayakai.dto.AuthResponse;
import com.sahayakai.dto.LoginRequest;
import com.sahayakai.dto.RegisterRequest;
import com.sahayakai.exception.BadRequestException;
import com.sahayakai.model.Role;
import com.sahayakai.model.User;
import com.sahayakai.repository.UserRepository;
import com.sahayakai.security.JwtTokenProvider;
import com.sahayakai.security.UserPrincipal;
import com.sahayakai.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, authenticationManager, tokenProvider);
    }

    @Test
    void register_ShouldCreateUserAndReturnAuthResponse() {
        RegisterRequest request = new RegisterRequest("Test User", "test@sahayak.ai", "1234567890", "password123", "USER");

        when(userRepository.existsByEmail("test@sahayak.ai")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");

        User savedUser = new User("Test User", "test@sahayak.ai", "1234567890", "hashedPassword", Role.ROLE_USER);
        savedUser.setId("user-123");

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(tokenProvider.generateTokenFromUserId("user-123", "test@sahayak.ai")).thenReturn("mock-jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("test@sahayak.ai", response.getUser().getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_DuplicateEmail_ShouldThrowBadRequestException() {
        RegisterRequest request = new RegisterRequest("Test User", "duplicate@sahayak.ai", "1234567890", "password123", "USER");
        when(userRepository.existsByEmail("duplicate@sahayak.ai")).thenReturn(true);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.register(request));
        assertEquals("An account with this email already exists.", ex.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_PasswordMismatch_ShouldThrowBadRequestException() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Test User");
        request.setEmail("mismatch@sahayak.ai");
        request.setPassword("password123");
        request.setConfirmPassword("differentPassword");

        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.register(request));
        assertEquals("Passwords do not match.", ex.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_ValidCredentials_ShouldReturnAuthResponse() {
        LoginRequest request = new LoginRequest("owner@sahayak.ai", "Password@123");

        User user = new User("Owner", "owner@sahayak.ai", "1234567890", "hashedPassword", Role.ROLE_OWNER);
        user.setId("owner-id");

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("owner-jwt-token");
        when(userRepository.findById("owner-id")).thenReturn(Optional.of(user));

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("owner-jwt-token", response.getToken());
        assertEquals("owner@sahayak.ai", response.getUser().getEmail());
        assertEquals("ROLE_OWNER", response.getUser().getRole());
    }

    @Test
    void login_InvalidCredentials_ShouldThrowBadCredentialsException() {
        LoginRequest request = new LoginRequest("user@sahayak.ai", "WrongPassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }
}
