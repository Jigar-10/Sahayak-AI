package com.sahayakai.dto;

import jakarta.validation.constraints.NotBlank;

public class CaseNoteDto {

    @NotBlank(message = "Note text cannot be blank")
    private String text;

    private String author;

    public CaseNoteDto() {
    }

    public CaseNoteDto(String text, String author) {
        this.text = text;
        this.author = author;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }
}
