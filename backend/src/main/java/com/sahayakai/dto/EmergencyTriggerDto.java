package com.sahayakai.dto;

public class EmergencyTriggerDto {

    private String emergencyType = "SOS_PANIC";
    private Double latitude;
    private Double longitude;
    private Double locationAccuracy;
    private String locationTimestamp;
    private String locationStatus = "PENDING"; // "LOCATION_RECEIVED", "LOCATION_DENIED", "LOCATION_UNAVAILABLE", "PENDING"
    private String notes;
    private String category = "Emergency Response";
    private String preferredLanguage = "en";
    private String channel = "sos_button";

    public EmergencyTriggerDto() {
    }

    public EmergencyTriggerDto(String emergencyType, Double latitude, Double longitude, Double locationAccuracy, String locationTimestamp, String locationStatus, String notes) {
        this.emergencyType = emergencyType;
        this.latitude = latitude;
        this.longitude = longitude;
        this.locationAccuracy = locationAccuracy;
        this.locationTimestamp = locationTimestamp;
        this.locationStatus = locationStatus;
        this.notes = notes;
    }

    public String getEmergencyType() {
        return emergencyType != null ? emergencyType : "SOS_PANIC";
    }

    public void setEmergencyType(String emergencyType) {
        this.emergencyType = emergencyType;
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
        return locationStatus != null ? locationStatus : "PENDING";
    }

    public void setLocationStatus(String locationStatus) {
        this.locationStatus = locationStatus;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getCategory() {
        return category != null ? category : "Emergency Response";
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPreferredLanguage() {
        return preferredLanguage != null ? preferredLanguage : "en";
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }

    public String getChannel() {
        return channel != null ? channel : "sos_button";
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }
}
