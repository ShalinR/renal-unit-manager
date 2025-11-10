package com.peradeniya.renal.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AdequacyResultsDto {

    private AdequacyTestEntryDto first;
    private AdequacyTestEntryDto second;
    private AdequacyTestEntryDto third;

    // --- Getters and Setters ---
    public AdequacyTestEntryDto getFirst() { return first; }
    public void setFirst(AdequacyTestEntryDto first) { this.first = first; }

    public AdequacyTestEntryDto getSecond() { return second; }
    public void setSecond(AdequacyTestEntryDto second) { this.second = second; }

    public AdequacyTestEntryDto getThird() { return third; }
    public void setThird(AdequacyTestEntryDto third) { this.third = third; }
}




