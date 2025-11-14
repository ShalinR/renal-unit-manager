package com.peradeniya.renal.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PetTestEntryDto {

    private String date;
    private PetDataDto data; // 'data' is a nested object

    // --- Getters and Setters ---
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public PetDataDto getData() { return data; }
    public void setData(PetDataDto data) { this.data = data; }
}