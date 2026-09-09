package com.sahayakai.model;

public enum Role {
    ROLE_USER,
    ROLE_OWNER,
    ROLE_ADMIN;

    public String getAuthority() {
        return name();
    }
}
