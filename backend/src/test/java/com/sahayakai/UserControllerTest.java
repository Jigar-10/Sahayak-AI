package com.sahayakai;

import com.sahayakai.controller.UserController;
import com.sahayakai.dto.ApiResponse;
import com.sahayakai.dto.UserDto;
import com.sahayakai.dto.UserProfileUpdateDto;
import com.sahayakai.model.Role;
import com.sahayakai.model.User;
import com.sahayakai.security.UserPrincipal;
import com.sahayakai.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Mock
    private AuthService authService;

    private UserController userController;

    @BeforeEach
    void setUp() {
        userController = new UserController(authService);
    }

    @Test
    void getMyProfile_Authenticated_ShouldReturnUserProfile() {
        User user = new User("Jane Doe", "jane@sahayak.ai", "9876543210", "hash", Role.ROLE_USER);
        user.setId("user-jane");
        UserPrincipal principal = UserPrincipal.create(user);
        UserDto userDto = new UserDto(user);

        when(authService.getCurrentUser(principal)).thenReturn(userDto);

        ResponseEntity<ApiResponse<UserDto>> response = userController.getMyProfile(principal);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertEquals("jane@sahayak.ai", response.getBody().getData().getEmail());
    }

    @Test
    void getMyProfile_Unauthenticated_ShouldReturn401() {
        ResponseEntity<ApiResponse<UserDto>> response = userController.getMyProfile(null);
        assertNotNull(response);
        assertEquals(401, response.getStatusCode().value());
    }

    @Test
    void updateMyProfile_ValidData_ShouldReturnUpdatedProfile() {
        User user = new User("Jane Doe", "jane@sahayak.ai", "9876543210", "hash", Role.ROLE_USER);
        user.setId("user-jane");
        UserPrincipal principal = UserPrincipal.create(user);

        UserProfileUpdateDto updateDto = new UserProfileUpdateDto("Jane Updated", "9998887776");
        User updatedUser = new User("Jane Updated", "jane@sahayak.ai", "9998887776", "hash", Role.ROLE_USER);
        updatedUser.setId("user-jane");
        UserDto updatedDto = new UserDto(updatedUser);

        when(authService.updateUserProfile("user-jane", updateDto)).thenReturn(updatedDto);

        ResponseEntity<ApiResponse<UserDto>> response = userController.updateMyProfile(principal, updateDto);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Jane Updated", response.getBody().getData().getName());
        assertEquals("9998887776", response.getBody().getData().getPhone());
    }
}
