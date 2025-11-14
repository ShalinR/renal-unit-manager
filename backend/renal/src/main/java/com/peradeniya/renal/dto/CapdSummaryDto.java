package com.peradeniya.renal.dto;



import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CapdSummaryDto {

    // Simple string fields
    private String counsellingDate;
    private String catheterInsertionDate;
    private String insertionDoneBy;
    private String insertionPlace;
    private String technique;
    private String designation;
    private String firstFlushing;
    private String secondFlushing;
    private String thirdFlushing;
    private String initiationDate;

    // Nested object for PET results
    private PetResultsDto petResults;

    // Nested object for Adequacy results
    private AdequacyResultsDto adequacyResults;

    // --- Getters and Setters ---
    // (You can auto-generate these in your IDE or use Lombok's @Data)

    public String getCounsellingDate() { return counsellingDate; }
    public void setCounsellingDate(String counsellingDate) { this.counsellingDate = counsellingDate; }

    public String getCatheterInsertionDate() { return catheterInsertionDate; }
    public void setCatheterInsertionDate(String catheterInsertionDate) { this.catheterInsertionDate = catheterInsertionDate; }

    public String getInsertionDoneBy() { return insertionDoneBy; }
    public void setInsertionDoneBy(String insertionDoneBy) { this.insertionDoneBy = insertionDoneBy; }

    public String getInsertionPlace() { return insertionPlace; }
    public void setInsertionPlace(String insertionPlace) { this.insertionPlace = insertionPlace; }

    public String getFirstFlushing() { return firstFlushing; }
    public void setFirstFlushing(String firstFlushing) { this.firstFlushing = firstFlushing; }

    public String getSecondFlushing() { return secondFlushing; }
    public void setSecondFlushing(String secondFlushing) { this.secondFlushing = secondFlushing; }

    public String getThirdFlushing() { return thirdFlushing; }
    public void setThirdFlushing(String thirdFlushing) { this.thirdFlushing = thirdFlushing; }

    public String getInitiationDate() { return initiationDate; }
    public void setInitiationDate(String initiationDate) { this.initiationDate = initiationDate; }

    public String getTechnique() { return technique; }
    public void setTechnique(String technique) { this.technique = technique; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public PetResultsDto getPetResults() { return petResults; }
    public void setPetResults(PetResultsDto petResults) { this.petResults = petResults; }

    public AdequacyResultsDto getAdequacyResults() { return adequacyResults; }
    public void setAdequacyResults(AdequacyResultsDto adequacyResults) { this.adequacyResults = adequacyResults; }
}