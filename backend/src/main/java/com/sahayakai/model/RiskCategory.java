package com.sahayakai.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RiskCategory {
    LOW("low"),
    MODERATE("moderate"),
    HIGH("high"),
    CRITICAL("critical");

    private final String value;

    RiskCategory(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static RiskCategory fromValue(String text) {
        if (text == null) return null;
        for (RiskCategory r : RiskCategory.values()) {
            if (r.value.equalsIgnoreCase(text) || r.name().equalsIgnoreCase(text)) {
                return r;
            }
        }
        return MODERATE;
    }
}
