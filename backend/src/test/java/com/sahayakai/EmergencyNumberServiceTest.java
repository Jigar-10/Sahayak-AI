package com.sahayakai;

import com.sahayakai.dto.EmergencyNumberDto;
import com.sahayakai.model.EmergencyNumber;
import com.sahayakai.repository.EmergencyNumberRepository;
import com.sahayakai.service.EmergencyNumberService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmergencyNumberServiceTest {

    @Mock
    private EmergencyNumberRepository repository;

    private EmergencyNumberService service;

    @BeforeEach
    void setUp() {
        service = new EmergencyNumberService(repository);
    }

    @Test
    void getAllActive_ShouldReturnSortedActiveNumbers() {
        EmergencyNumber num1 = new EmergencyNumber("112", "ERSS", "112", "Emergency", "Emergency", true, "Siren", "24/7");
        EmergencyNumber num2 = new EmergencyNumber("181", "Women Helpline", "181", "Support", "Women", false, "Shield", "24/7");

        when(repository.findByActiveTrueOrderByIsPrimaryDescNameAsc()).thenReturn(Arrays.asList(num1, num2));

        List<EmergencyNumber> results = service.getAllActive();

        assertEquals(2, results.size());
        assertEquals("112", results.get(0).getNumber());
    }

    @Test
    void create_ShouldSaveAndReturnEmergencyNumber() {
        EmergencyNumberDto dto = new EmergencyNumberDto();
        dto.setId("100");
        dto.setName("Police");
        dto.setNumber("100");
        dto.setCategory("Emergency");
        dto.setPrimary(true);

        when(repository.save(any(EmergencyNumber.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EmergencyNumber created = service.create(dto);

        assertNotNull(created);
        assertEquals("100", created.getNumber());
        assertTrue(created.isActive());
        assertTrue(created.isPrimary());
    }

    @Test
    void getById_Found_ShouldReturnEntity() {
        EmergencyNumber num = new EmergencyNumber("112", "ERSS", "112", "Emergency", "Emergency", true, "Siren", "24/7");
        when(repository.findById("112")).thenReturn(Optional.of(num));

        EmergencyNumber found = service.getById("112");
        assertNotNull(found);
        assertEquals("112", found.getId());
    }
}
