package com.sahayakai.controller;

import com.sahayakai.dto.ApiResponse;
import com.sahayakai.dto.EmergencyLocationUpdateDto;
import com.sahayakai.dto.EmergencyStatusUpdateDto;
import com.sahayakai.dto.EmergencyTriggerDto;
import com.sahayakai.model.CaseRecord;
import com.sahayakai.security.UserPrincipal;
import com.sahayakai.service.CaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency")
@Tag(name = "Emergency Location & Response", description = "Endpoints for emergency SOS triggering, live device GPS transmission, and responder dispatch")
public class EmergencyController {

    private final CaseService caseService;

    public EmergencyController(CaseService caseService) {
        this.caseService = caseService;
    }

    @PostMapping("/trigger")
    @Operation(summary = "Trigger immediate emergency SOS with live device GPS location")
    public ResponseEntity<ApiResponse<CaseRecord>> triggerEmergency(
            @RequestBody EmergencyTriggerDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CaseRecord created = caseService.triggerEmergency(dto, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Emergency SOS registered with live location. Responders alerted.", created));
    }

    @PostMapping("/{id}/location")
    @Operation(summary = "Transmit updated live device GPS coordinates for an active emergency")
    public ResponseEntity<ApiResponse<CaseRecord>> updateLocation(
            @PathVariable String id,
            @Valid @RequestBody EmergencyLocationUpdateDto dto
    ) {
        CaseRecord updated = caseService.updateEmergencyLocation(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Live emergency location updated successfully", updated));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Get active emergency cases with live coordinates (Police & Ambulance Responders only)")
    public ResponseEntity<ApiResponse<List<CaseRecord>>> getActiveEmergencies() {
        List<CaseRecord> activeEmergencies = caseService.getActiveEmergencies();
        return ResponseEntity.ok(ApiResponse.success(activeEmergencies));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Update emergency lifecycle status (Responders only)")
    public ResponseEntity<ApiResponse<CaseRecord>> updateEmergencyStatus(
            @PathVariable String id,
            @Valid @RequestBody EmergencyStatusUpdateDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CaseRecord updated = caseService.updateEmergencyStatus(id, dto, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Emergency status updated to " + dto.getEmergencyStatus(), updated));
    }
}
