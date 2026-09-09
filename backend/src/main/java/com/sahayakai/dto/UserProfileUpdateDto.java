package com.sahayakai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserProfileUpdateDto {

    @NotBlank(message = "Name cannot be blank")
    @Size(min = 2, max = 80, message = "Name must be between 2 and 80 characters")
    private String name;

    private String phone;

    public UserProfileUpdateDto() {
    }

    public UserProfileUpdateDto(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
