package com.sahayakai.dto;

import com.sahayakai.model.CaseStatus;
import jakarta.validation.constraints.NotNull;

public class CaseStatusDto {

    @NotNull(message = "Status is required")
    private CaseStatus status;

    public CaseStatusDto() {
    }

    public CaseStatusDto(CaseStatus status) {
        this.status = status;
    }

    public CaseStatus getStatus() {
        return status;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
    }
}
