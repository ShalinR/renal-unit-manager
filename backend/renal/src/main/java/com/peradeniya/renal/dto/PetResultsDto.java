package com.peradeniya.renal.dto;



import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PetResultsDto {

    private PetTestEntryDto first;
    private PetTestEntryDto second;
    private PetTestEntryDto third;

    // --- Getters and Setters ---
    public PetTestEntryDto getFirst() { return first; }
    public void setFirst(PetTestEntryDto first) { this.first = first; }

    public PetTestEntryDto getSecond() { return second; }
    public void setSecond(PetTestEntryDto second) { this.second = second; }

    public PetTestEntryDto getThird() { return third; }
    public void setThird(PetTestEntryDto third) { this.third = third; }
}