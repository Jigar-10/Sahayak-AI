package com.sahayakai.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "emergency_numbers")
public class EmergencyNumber {

    @Id
    private String id;

    private String name;

    private String number;

    private String description;

    @Indexed
    private String category; // 'Emergency', 'Women & Child Support', 'SC/ST Support', 'Cyber Crime'

    private String state = "All India";

    private boolean available24x7 = true;

    private boolean active = true;

    private boolean isPrimary = false;

    private String iconName = "Phone";

    private String availability = "Available 24/7";

    @CreatedDate
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    private Instant updatedAt = Instant.now();

    public EmergencyNumber() {
    }

    public EmergencyNumber(String id, String name, String number, String description, String category,
                           boolean isPrimary, String iconName, String availability) {
        this.id = id;
        this.name = name;
        this.number = number;
        this.description = description;
        this.category = category;
        this.isPrimary = isPrimary;
        this.iconName = iconName;
        this.availability = availability;
        this.active = true;
        this.available24x7 = availability != null && availability.contains("24/7");
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
