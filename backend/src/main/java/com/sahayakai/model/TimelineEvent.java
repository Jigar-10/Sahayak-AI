package com.sahayakai.model;

import java.time.Instant;

public class TimelineEvent {
    private String id;
    private String label;
    private String timestamp;

    public TimelineEvent() {
    }

    public TimelineEvent(String id, String label, String timestamp) {
        this.id = id;
        this.label = label;
        this.timestamp = timestamp != null ? timestamp : Instant.now().toString();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
