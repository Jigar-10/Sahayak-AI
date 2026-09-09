package com.sahayakai.model;

import java.time.Instant;

public class CaseUpdate {
    private String id;
    private String caseId;
    private CaseStatus status;
    private String title;
    private String message;
    private String timestamp;
    private String updatedBy;
    private String department;

    public CaseUpdate() {
        this.timestamp = Instant.now().toString();
    }

    public CaseUpdate(String id, String caseId, CaseStatus status, String title, String message, String updatedBy, String department) {
        this.id = id;
        this.caseId = caseId;
        this.status = status;
        this.title = title;
        this.message = message;
        this.timestamp = Instant.now().toString();
        this.updatedBy = updatedBy;
        this.department = department;
    }

    public CaseUpdate(String id, String caseId, CaseStatus status, String title, String message, String timestamp, String updatedBy, String department) {
        this.id = id;
        this.caseId = caseId;
        this.status = status;
        this.title = title;
        this.message = message;
        this.timestamp = timestamp != null ? timestamp : Instant.now().toString();
        this.updatedBy = updatedBy;
        this.department = department;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCaseId() {
        return caseId;
    }

    public void setCaseId(String caseId) {
        this.caseId = caseId;
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

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
