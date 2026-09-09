package com.sahayakai;

import com.sahayakai.dto.CaseAssignDto;
import com.sahayakai.dto.CaseCreateDto;
import com.sahayakai.dto.CaseNoteDto;
import com.sahayakai.dto.PagedResponse;
import com.sahayakai.model.CaseRecord;
import com.sahayakai.model.CaseStatus;
import com.sahayakai.model.RiskCategory;
import com.sahayakai.model.User;
import com.sahayakai.repository.CaseRepository;
import com.sahayakai.security.UserPrincipal;
import com.sahayakai.service.CaseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CaseServiceTest {

    @Mock
    private CaseRepository caseRepository;

    private CaseService caseService;

    @BeforeEach
    void setUp() {
        caseService = new CaseService(caseRepository);
    }

    @Test
    void createCase_WithAuthenticatedUser_ShouldAssignUserIdAndInitialTimeline() {
        User user = new User("Ananya Patel", "user@sahayak.ai", "123", "pass", com.sahayakai.model.Role.ROLE_USER);
        user.setId("user-1");
        UserPrincipal principal = UserPrincipal.create(user);

        CaseCreateDto dto = new CaseCreateDto();
        dto.setTitle("Workplace Grievance");
        dto.setCategory("Workplace Harassment");
        dto.setDescription("Incident details described by citizen");
        dto.setPriority("High");

        when(caseRepository.count()).thenReturn(5L);
        when(caseRepository.save(any(CaseRecord.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CaseRecord created = caseService.createCase(dto, principal);

        assertNotNull(created);
        assertEquals("CASE-2026-00127", created.getId());
        assertEquals("CASE-2026-00127", created.getCaseNumber());
        assertEquals("user-1", created.getUserId());
        assertEquals("Workplace Grievance", created.getTitle());
        assertEquals("Workplace Harassment", created.getCategory());
        assertEquals(CaseStatus.SUBMITTED, created.getStatus());
        assertEquals(5, created.getTimeline().size());
        assertEquals(1, created.getUpdates().size());
    }

    @Test
    void createCase_Unauthenticated_ShouldThrowAccessDeniedException() {
        CaseCreateDto dto = new CaseCreateDto();
        dto.setTitle("Unauthorized complaint");

        assertThrows(AccessDeniedException.class, () -> caseService.createCase(dto, null));
    }

    @Test
    void getCaseById_UserOwnsCase_ShouldReturnCase() {
        CaseRecord existing = new CaseRecord();
        existing.setId("CASE-2026-00122");
        existing.setUserId("user-1");

        when(caseRepository.findById("CASE-2026-00122")).thenReturn(Optional.of(existing));

        User user = new User("Citizen", "citizen@sahayak.ai", "123", "pass", com.sahayakai.model.Role.ROLE_USER);
        user.setId("user-1");
        UserPrincipal principal = UserPrincipal.create(user);

        CaseRecord found = caseService.getCaseById("CASE-2026-00122", principal);
        assertNotNull(found);
        assertEquals("CASE-2026-00122", found.getId());
    }

    @Test
    void getCaseById_OtherUserAttemptsAccess_ShouldThrowAccessDeniedException() {
        CaseRecord existing = new CaseRecord();
        existing.setId("CASE-2026-00122");
        existing.setUserId("user-1");

        when(caseRepository.findById("CASE-2026-00122")).thenReturn(Optional.of(existing));

        User user2 = new User("Other Citizen", "other@sahayak.ai", "123", "pass", com.sahayakai.model.Role.ROLE_USER);
        user2.setId("user-2");
        UserPrincipal principal = UserPrincipal.create(user2);

        assertThrows(AccessDeniedException.class, () -> caseService.getCaseById("CASE-2026-00122", principal));
    }

    @Test
    void getCaseById_StaffUser_ShouldAllowAccessToAnyCase() {
        CaseRecord existing = new CaseRecord();
        existing.setId("CASE-2026-00122");
        existing.setUserId("user-1");

        when(caseRepository.findById("CASE-2026-00122")).thenReturn(Optional.of(existing));

        User owner = new User("Officer", "owner@sahayak.ai", "123", "pass", com.sahayakai.model.Role.ROLE_OWNER);
        owner.setId("owner-99");
        UserPrincipal principal = UserPrincipal.create(owner);

        CaseRecord found = caseService.getCaseById("CASE-2026-00122", principal);
        assertNotNull(found);
        assertEquals("CASE-2026-00122", found.getId());
    }

    @Test
    void assignOfficer_ShouldUpdateStatusAndAppendTimeline() {
        CaseRecord existing = new CaseRecord();
        existing.setId("CASE-2026-00122");
        existing.setStatus(CaseStatus.SUBMITTED);
        existing.setTimeline(new ArrayList<>());
        existing.setUpdates(new ArrayList<>());

        when(caseRepository.findById("CASE-2026-00122")).thenReturn(Optional.of(existing));
        when(caseRepository.save(any(CaseRecord.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CaseAssignDto dto = new CaseAssignDto("Officer Rajesh Kumar");
        CaseRecord updated = caseService.assignOfficer("CASE-2026-00122", dto);

        assertEquals("Officer Rajesh Kumar", updated.getAssignedOfficer());
        assertEquals(CaseStatus.ASSIGNED, updated.getStatus());
        assertEquals(1, updated.getTimeline().size());
        assertTrue(updated.getTimeline().get(0).getLabel().contains("Officer Rajesh Kumar"));
        assertEquals(1, updated.getUpdates().size());
    }

    @Test
    void addNote_ShouldAppendNoteAndTimeline() {
        CaseRecord existing = new CaseRecord();
        existing.setId("CASE-2026-00122");
        existing.setNotes(new ArrayList<>());
        existing.setTimeline(new ArrayList<>());

        when(caseRepository.findById("CASE-2026-00122")).thenReturn(Optional.of(existing));
        when(caseRepository.save(any(CaseRecord.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CaseNoteDto dto = new CaseNoteDto("Follow-up call scheduled", "Meera Sharma");
        CaseRecord updated = caseService.addNote("CASE-2026-00122", dto, null);

        assertEquals(1, updated.getNotes().size());
        assertEquals("Follow-up call scheduled", updated.getNotes().get(0).getText());
        assertEquals(1, updated.getTimeline().size());
    }

    @Test
    void getAllCases_WithFilter_ShouldFilterCorrectly() {
        CaseRecord case1 = new CaseRecord();
        case1.setId("1");
        case1.setRiskCategory(RiskCategory.CRITICAL);
        case1.setStatus(CaseStatus.SUBMITTED);
        case1.setChannel("text");

        CaseRecord case2 = new CaseRecord();
        case2.setId("2");
        case2.setRiskCategory(RiskCategory.LOW);
        case2.setStatus(CaseStatus.CLOSED);
        case2.setChannel("text");

        when(caseRepository.findAll()).thenReturn(java.util.Arrays.asList(case1, case2));

        PagedResponse<CaseRecord> response = caseService.getAllCases("critical", "all", "all", PageRequest.of(0, 10));

        assertEquals(1, response.getContent().size());
        assertEquals("1", response.getContent().get(0).getId());
    }
}
