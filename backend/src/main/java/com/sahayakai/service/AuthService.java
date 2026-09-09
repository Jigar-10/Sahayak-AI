package com.sahayakai.service;

import com.sahayakai.dto.AuthResponse;
import com.sahayakai.dto.LoginRequest;
import com.sahayakai.dto.RegisterRequest;
import com.sahayakai.dto.UserDto;
import com.sahayakai.exception.BadRequestException;
import com.sahayakai.exception.ResourceNotFoundException;
import com.sahayakai.model.Role;
import com.sahayakai.model.User;
import com.sahayakai.repository.UserRepository;
import com.sahayakai.security.JwtTokenProvider;
import com.sahayakai.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BadRequestException("Email is required.");
        }
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with this email already exists.");
        }

        if (request.getConfirmPassword() != null && !request.getConfirmPassword().isBlank()) {
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                throw new BadRequestException("Passwords do not match.");
            }
        }

        String displayName = request.getFullName();
        if (displayName == null || displayName.isBlank()) {
            displayName = request.getName();
        }
        if (displayName == null || displayName.isBlank()) {
            throw new BadRequestException("Full name is required.");
        }

        // Public citizen registration always assigns ROLE_USER to prevent privilege escalation
        Role role = Role.ROLE_USER;

        User user = new User(
                displayName.trim(),
                request.getEmail().toLowerCase().trim(),
                request.getPhone() != null ? request.getPhone().trim() : null,
                passwordEncoder.encode(request.getPassword()),
                role
        );

        User savedUser = userRepository.save(user);

        String token = tokenProvider.generateTokenFromUserId(savedUser.getId(), savedUser.getEmail());
        return new AuthResponse(token, new UserDto(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(token, new UserDto(user));
    }

    public AuthResponse ownerLogin(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BadRequestException("Official email is required.");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password is required.");
        }

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase().trim(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid official email or password.");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .or(() -> userRepository.findByEmailIgnoreCase(request.getEmail().toLowerCase().trim()))
                .orElseThrow(() -> new BadCredentialsException("Invalid official email or password."));

        if (user.getRole() != Role.ROLE_OWNER && user.getRole() != Role.ROLE_ADMIN) {
            throw new BadRequestException("Unauthorized: Account does not have Owner privileges.");
        }

        String token = tokenProvider.generateToken(authentication);
        return new AuthResponse(token, new UserDto(user));
    }

    public UserDto getCurrentUser(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return new UserDto(user);
    }

    public UserDto updateUserProfile(String userId, com.sahayakai.dto.UserProfileUpdateDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName().trim());
        }
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone().trim());
        }
        user.setUpdatedAt(java.time.Instant.now());
        User saved = userRepository.save(user);
        return new UserDto(saved);
    }
}
