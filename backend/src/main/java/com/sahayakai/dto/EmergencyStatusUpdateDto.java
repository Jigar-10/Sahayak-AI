package com.sahayakai.dto;

import jakarta.validation.constraints.NotBlank;

public class EmergencyStatusUpdateDto {

    @NotBlank(message = "Emergency status is required")
    private String emergencyStatus; // "EMERGENCY_TRIGGERED", "LOCATION_RECEIVED", "RESPONDERS_NOTIFIED", "IN_PROGRESS", "RESOLVED"

    private String responderNotes;

    public EmergencyStatusUpdateDto() {
    }

    public EmergencyStatusUpdateDto(String emergencyStatus, String responderNotes) {
        this.emergencyStatus = emergencyStatus;
        this.responderNotes = responderNotes;
    }

    public String getEmergencyStatus() {
        return emergencyStatus;
    }

    public void setEmergencyStatus(String emergencyStatus) {
        this.emergencyStatus = emergencyStatus;
    }

    public String getResponderNotes() {
        return responderNotes;
    }

    public void setResponderNotes(String responderNotes) {
        this.responderNotes = responderNotes;
    }
}
