package com.sahayakai.dto;

import jakarta.validation.constraints.NotNull;

public class EmergencyLocationUpdateDto {

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private Double locationAccuracy;

    private String locationTimestamp;

    private String locationStatus = "LOCATION_RECEIVED";

    public EmergencyLocationUpdateDto() {
    }

    public EmergencyLocationUpdateDto(Double latitude, Double longitude, Double locationAccuracy, String locationTimestamp, String locationStatus) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.locationAccuracy = locationAccuracy;
        this.locationTimestamp = locationTimestamp;
        this.locationStatus = locationStatus;
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
        return locationStatus != null ? locationStatus : "LOCATION_RECEIVED";
    }

    public void setLocationStatus(String locationStatus) {
        this.locationStatus = locationStatus;
    }
}
