package com.sahayakai.dto;

import jakarta.validation.constraints.NotBlank;

public class EmergencyNumberDto {
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Number is required")
    private String number;

    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    private String state = "All India";
    private boolean available24x7 = true;
    private boolean active = true;
    private boolean isPrimary = false;
    private String iconName = "Phone";
    private String availability = "Available 24/7";

    public EmergencyNumberDto() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public boolean isAvailable24x7() {
        return available24x7;
    }

    public void setAvailable24x7(boolean available24x7) {
        this.available24x7 = available24x7;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isPrimary() {
        return isPrimary;
    }

    public void setPrimary(boolean primary) {
        isPrimary = primary;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }
}
