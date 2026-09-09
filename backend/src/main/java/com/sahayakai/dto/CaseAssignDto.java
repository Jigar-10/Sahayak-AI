package com.sahayakai.dto;

import jakarta.validation.constraints.NotBlank;

public class CaseAssignDto {

    @NotBlank(message = "Officer name is required")
    private String officer;

    public CaseAssignDto() {
    }

    public CaseAssignDto(String officer) {
        this.officer = officer;
    }

    public String getOfficer() {
        return officer;
    }

    public void setOfficer(String officer) {
        this.officer = officer;
    }
}
