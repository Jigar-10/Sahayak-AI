package com.sahayakai.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CaseStatus {
    SUBMITTED("submitted", "Submitted"),
    UNDER_REVIEW("under-review", "Under Review"),
    ASSIGNED("assigned", "Assigned"),
    INVESTIGATION("investigation", "Investigation"),
    ACTION_TAKEN("action-taken", "Action Taken"),
    RESOLVED("resolved", "Resolved"),
    CLOSED("closed", "Closed"),
    REJECTED("rejected", "Rejected"),
    OPEN("open", "Open"),
    IN_REVIEW("in-review", "Under Review");

    private final String value;
    private final String displayName;

    CaseStatus(String value, String displayName) {
        this.value = value;
        this.displayName = displayName;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static CaseStatus fromValue(String text) {
        if (text == null) return null;
        for (CaseStatus s : CaseStatus.values()) {
            if (s.value.equalsIgnoreCase(text) ||
                s.name().equalsIgnoreCase(text) ||
                s.name().replace('_', '-').equalsIgnoreCase(text) ||
                s.displayName.equalsIgnoreCase(text)) {
                return s;
            }
        }
        return OPEN;
    }
}
