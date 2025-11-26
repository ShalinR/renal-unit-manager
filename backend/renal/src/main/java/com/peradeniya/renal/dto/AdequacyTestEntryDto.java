package com.peradeniya.renal.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AdequacyTestEntryDto {

    private String date;
    private AdequacyDataDto data; // 'data' is a nested object

    // --- Getters and Setters ---
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public AdequacyDataDto getData() { return data; }
    public void setData(AdequacyDataDto data) { this.data = data; }
}




