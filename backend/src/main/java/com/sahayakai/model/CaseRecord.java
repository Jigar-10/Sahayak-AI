package com.sahayakai.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "cases")
public class CaseRecord {

    @Id
    private String id; // e.g. "CASE-2026-00122"

    @Indexed(unique = true)
    private String caseNumber;

    @Indexed
    private String userId;

    private String title;

    private String category;

    private String description;

    private String priority;

    private String assignedDepartment;

    private String assessmentId;

    private String createdAt = Instant.now().toString();

    private String channel = "text";

    private String language = "en";

    private int svi = 0;

    @Indexed
    private RiskCategory riskCategory = RiskCategory.MODERATE;

    private boolean immediateDanger = false;

    private List<Indicator> indicators = new ArrayList<>();

    private List<String> explainableIndicators = new ArrayList<>();

    private int aiConfidence = 85;

    private String narrative = "";

    private String incidentCategory = "other";

    @Indexed
    private String assignedOfficer = null;

    @Indexed
    private CaseStatus status = CaseStatus.SUBMITTED;

    private List<String> recommendedActions = new ArrayList<>();

    private List<CaseNote> notes = new ArrayList<>();

    private boolean escalated = false;

    private List<TimelineEvent> timeline = new ArrayList<>();

    private List<CaseUpdate> updates = new ArrayList<>();

    @LastModifiedDate
    private Instant updatedAt = Instant.now();

    public CaseRecord() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
        this.caseNumber = id;
    }

    public String getCaseNumber() {
        return caseNumber != null ? caseNumber : id;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTitle() {
        if (title != null && !title.isBlank()) {
            return title;
        }
        String cat = getCategory();
        if (cat != null && !cat.isBlank()) {
            return "Complaint: " + cat.substring(0, 1).toUpperCase() + cat.substring(1).replace('-', ' ');
        }
        return "Grievance Report";
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        if (category != null && !category.isBlank()) {
            return category;
        }
        return incidentCategory != null ? incidentCategory : "other";
    }

    public void setCategory(String category) {
        this.category = category;
        this.incidentCategory = category;
    }

    public String getDescription() {
        if (description != null && !description.isBlank()) {
            return description;
        }
        return narrative != null ? narrative : "";
    }

    public void setDescription(String description) {
        this.description = description;
        this.narrative = description;
    }

    public String getPriority() {
        if (priority != null && !priority.isBlank()) {
            return priority;
        }
        return riskCategory != null ? riskCategory.getValue() : "moderate";
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getAssignedDepartment() {
        if (assignedDepartment != null && !assignedDepartment.isBlank()) {
            return assignedDepartment;
        }
        if (assignedOfficer != null) {
            if (assignedOfficer.toLowerCase().contains("legal")) return "Legal Services Division";
            if (assignedOfficer.toLowerCase().contains("counsellor")) return "Counselling & Support Services";
            if (assignedOfficer.toLowerCase().contains("protection")) return "Protection & Safety Bureau";
            return "Public Grievance Redressal";
        }
        return "Grievance Redressal Cell";
    }

    public void setAssignedDepartment(String assignedDepartment) {
        this.assignedDepartment = assignedDepartment;
    }

    public String getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(String assessmentId) {
        this.assessmentId = assessmentId;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public int getSvi() {
        return svi;
    }

    public void setSvi(int svi) {
        this.svi = svi;
    }

    public RiskCategory getRiskCategory() {
        return riskCategory;
    }

    public void setRiskCategory(RiskCategory riskCategory) {
        this.riskCategory = riskCategory;
        if (riskCategory != null) {
            this.priority = riskCategory.getValue();
        }
    }

    public boolean isImmediateDanger() {
        return immediateDanger;
    }

    public void setImmediateDanger(boolean immediateDanger) {
        this.immediateDanger = immediateDanger;
    }

    public List<Indicator> getIndicators() {
        return indicators;
    }

    public void setIndicators(List<Indicator> indicators) {
        this.indicators = indicators != null ? indicators : new ArrayList<>();
    }

    public List<String> getExplainableIndicators() {
        return explainableIndicators;
    }

    public void setExplainableIndicators(List<String> explainableIndicators) {
        this.explainableIndicators = explainableIndicators != null ? explainableIndicators : new ArrayList<>();
    }

    public int getAiConfidence() {
        return aiConfidence;
    }

    public void setAiConfidence(int aiConfidence) {
        this.aiConfidence = aiConfidence;
    }

    public String getNarrative() {
        return narrative;
    }

    public void setNarrative(String narrative) {
        this.narrative = narrative;
        if (this.description == null || this.description.isBlank()) {
            this.description = narrative;
        }
    }

    public String getIncidentCategory() {
        return incidentCategory;
    }

    public void setIncidentCategory(String incidentCategory) {
        this.incidentCategory = incidentCategory;
        if (this.category == null || this.category.isBlank()) {
            this.category = incidentCategory;
        }
    }

    public String getAssignedOfficer() {
        return assignedOfficer;
    }

    public void setAssignedOfficer(String assignedOfficer) {
        this.assignedOfficer = assignedOfficer;
    }

    public CaseStatus getStatus() {
        return status != null ? status : CaseStatus.SUBMITTED;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
    }

    public List<String> getRecommendedActions() {
        return recommendedActions;
    }

    public void setRecommendedActions(List<String> recommendedActions) {
        this.recommendedActions = recommendedActions != null ? recommendedActions : new ArrayList<>();
    }

    public List<CaseNote> getNotes() {
        return notes;
    }

    public void setNotes(List<CaseNote> notes) {
        this.notes = notes != null ? notes : new ArrayList<>();
    }

    public boolean isEscalated() {
        return escalated;
    }

    public void setEscalated(boolean escalated) {
        this.escalated = escalated;
    }

    public List<TimelineEvent> getTimeline() {
        return timeline;
    }

    public void setTimeline(List<TimelineEvent> timeline) {
        this.timeline = timeline != null ? timeline : new ArrayList<>();
    }

    public List<CaseUpdate> getUpdates() {
        return updates != null ? updates : new ArrayList<>();
    }

    public void setUpdates(List<CaseUpdate> updates) {
        this.updates = updates != null ? updates : new ArrayList<>();
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
