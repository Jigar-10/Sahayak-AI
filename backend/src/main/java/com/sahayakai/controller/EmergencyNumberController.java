package com.sahayakai.controller;

import com.sahayakai.dto.ApiResponse;
import com.sahayakai.dto.EmergencyNumberDto;
import com.sahayakai.model.EmergencyNumber;
import com.sahayakai.service.EmergencyNumberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-numbers")
@Tag(name = "Emergency Numbers", description = "Verified national & regional emergency helplines")
public class EmergencyNumberController {

    private final EmergencyNumberService service;

    public EmergencyNumberController(EmergencyNumberService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Get all active emergency numbers (Public)")
    public ResponseEntity<ApiResponse<List<EmergencyNumber>>> getAllActive() {
        List<EmergencyNumber> numbers = service.getAllActive();
        return ResponseEntity.ok(ApiResponse.success(numbers));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get emergency number details by ID")
    public ResponseEntity<ApiResponse<EmergencyNumber>> getById(@PathVariable String id) {
        EmergencyNumber number = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success(number));
    }

    @PostMapping
    @Operation(summary = "Create an emergency number (Owner/Admin)")
    public ResponseEntity<ApiResponse<EmergencyNumber>> create(@Valid @RequestBody EmergencyNumberDto dto) {
        EmergencyNumber created = service.create(dto);
        return ResponseEntity.ok(ApiResponse.success("Emergency number created", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an emergency number (Owner/Admin)")
    public ResponseEntity<ApiResponse<EmergencyNumber>> update(
            @PathVariable String id,
            @Valid @RequestBody EmergencyNumberDto dto
    ) {
        EmergencyNumber updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Emergency number updated", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an emergency number (Owner/Admin)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Emergency number deleted", null));
    }
}
