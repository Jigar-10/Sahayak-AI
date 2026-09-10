package com.sahayakai.dto;

import com.sahayakai.model.Indicator;
import com.sahayakai.model.RiskCategory;

import java.util.List;

public class CaseCreateDto {
    private String assessmentId;
    private String channel = "text";
    private String language = "en";
    private int svi;
    private RiskCategory riskCategory = RiskCategory.MODERATE;
    private boolean immediateDanger;
    private List<Indicator> indicators;
    private List<String> explainableIndicators;
    private int aiConfidence = 80;
    private String narrative;
    private String incidentCategory = "other";
    private List<String> recommendedActions;

    // Direct application fields
    private String title;
    private String category;
    private String description;
    private String priority;
    private String department;
    private String location;
    private String contactPreference;

    // Optional GPS Geolocation
    private boolean isEmergency;
    private Double latitude;
    private Double longitude;
    private Double locationAccuracy;
    private String locationTimestamp;
    private String locationStatus;

    public CaseCreateDto() {
    }

    public String getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(String assessmentId) {
        this.assessmentId = assessmentId;
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
        this.indicators = indicators;
    }

    public List<String> getExplainableIndicators() {
        return explainableIndicators;
    }

    public void setExplainableIndicators(List<String> explainableIndicators) {
        this.explainableIndicators = explainableIndicators;
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
    }

    public String getIncidentCategory() {
        return incidentCategory;
    }

    public void setIncidentCategory(String incidentCategory) {
        this.incidentCategory = incidentCategory;
    }

    public List<String> getRecommendedActions() {
        return recommendedActions;
    }

    public void setRecommendedActions(List<String> recommendedActions) {
        this.recommendedActions = recommendedActions;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getContactPreference() {
        return contactPreference;
    }

    public void setContactPreference(String contactPreference) {
        this.contactPreference = contactPreference;
    }

    public boolean isEmergency() {
        return isEmergency;
    }

    public void setEmergency(boolean emergency) {
        isEmergency = emergency;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLocationAccuracy() {
        return locationAccuracy;
    }

    public void setLocationAccuracy(Double locationAccuracy) {
        this.locationAccuracy = locationAccuracy;
    }

    public String getLocationTimestamp() {
        return locationTimestamp;
    }

    public void setLocationTimestamp(String locationTimestamp) {
        this.locationTimestamp = locationTimestamp;
    }

    public String getLocationStatus() {
        return locationStatus;
    }

    public void setLocationStatus(String locationStatus) {
        this.locationStatus = locationStatus;
    }
}
