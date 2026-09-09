package com.sahayakai.controller;

import com.sahayakai.dto.*;
import com.sahayakai.model.CaseRecord;
import com.sahayakai.model.CaseUpdate;
import com.sahayakai.security.UserPrincipal;
import com.sahayakai.service.CaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
@Tag(name = "Cases", description = "Case management, escalation, timeline, updates, and assignment APIs")
public class CaseController {

    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    @GetMapping
    @Operation(summary = "Get paginated cases with risk, status, and channel filters (Owner/Admin only)")
    public ResponseEntity<ApiResponse<PagedResponse<CaseRecord>>> getAllCases(
            @RequestParam(required = false, defaultValue = "all") String risk,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false, defaultValue = "all") String channel,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<CaseRecord> pagedCases = caseService.getAllCases(risk, status, channel, pageable);
        return ResponseEntity.ok(ApiResponse.success(pagedCases));
    }

    @GetMapping({"/my-cases", "/my"})
    @Operation(summary = "Get cases created exclusively by the currently authenticated user")
    public ResponseEntity<ApiResponse<List<CaseRecord>>> getMyCases(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        List<CaseRecord> userCases = caseService.getUserCases(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(userCases));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single case details by Case ID with ownership validation")
    public ResponseEntity<ApiResponse<CaseRecord>> getCaseById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CaseRecord caseRecord = caseService.getCaseById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(caseRecord));
    }

    @GetMapping("/{id}/updates")
    @Operation(summary = "Get chronological progress updates for a case with ownership validation")
    public ResponseEntity<ApiResponse<List<CaseUpdate>>> getCaseUpdates(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<CaseUpdate> updates = caseService.getCaseUpdates(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(updates));
    }

    @PostMapping("/{id}/updates")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Add an official progress update to a case (Staff only)")
    public ResponseEntity<ApiResponse<CaseRecord>> addCaseUpdate(
            @PathVariable String id,
            @Valid @RequestBody CaseUpdateDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CaseRecord updated = caseService.addCaseUpdate(id, dto, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Case update posted successfully", updated));
    }

    @PostMapping
    @Operation(summary = "Create a new case / complaint (Authenticated users only)")
    public ResponseEntity<ApiResponse<CaseRecord>> createCase(
            @Valid @RequestBody CaseCreateDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required to file a complaint"));
        }
        CaseRecord created = caseService.createCase(dto, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Case created successfully", created));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Assign a case to a counsellor or officer (Staff only)")
    public ResponseEntity<ApiResponse<CaseRecord>> assignOfficer(
            @PathVariable String id,
            @Valid @RequestBody CaseAssignDto dto
    ) {
        CaseRecord updated = caseService.assignOfficer(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Case assigned successfully", updated));
    }

    @PostMapping("/{id}/notes")
    @Operation(summary = "Add a progress note to a case")
    public ResponseEntity<ApiResponse<CaseRecord>> addNote(
            @PathVariable String id,
            @Valid @RequestBody CaseNoteDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CaseRecord updated = caseService.addNote(id, dto, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Note added successfully", updated));
    }

    @PatchMapping("/{id}/escalate")
    @Operation(summary = "Escalate a case for immediate human review")
    public ResponseEntity<ApiResponse<CaseRecord>> escalateCase(@PathVariable String id) {
        CaseRecord updated = caseService.escalateCase(id);
        return ResponseEntity.ok(ApiResponse.success("Case escalated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Update case status (Staff only)")
    public ResponseEntity<ApiResponse<CaseRecord>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody CaseStatusDto dto
    ) {
        CaseRecord updated = caseService.updateStatus(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Case status updated successfully", updated));
    }

    @GetMapping("/officers")
    @Operation(summary = "Get list of available caseworkers and counsellors")
    public ResponseEntity<ApiResponse<List<String>>> getOfficers() {
        return ResponseEntity.ok(ApiResponse.success(caseService.getAvailableOfficers()));
    }
}
