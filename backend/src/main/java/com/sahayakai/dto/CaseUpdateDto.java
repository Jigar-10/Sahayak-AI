package com.sahayakai.dto;

import com.sahayakai.model.CaseStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CaseUpdateDto {

    @NotNull(message = "Status cannot be null")
    private CaseStatus status;

    @NotBlank(message = "Title cannot be blank")
    private String title;

    @NotBlank(message = "Message cannot be blank")
    private String message;

    private String department;

    public CaseUpdateDto() {
    }

    public CaseUpdateDto(CaseStatus status, String title, String message, String department) {
        this.status = status;
        this.title = title;
        this.message = message;
        this.department = department;
    }

    public CaseStatus getStatus() {
        return status;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
