package com.peradeniya.renal.dto;

public class MedicationDTO {
    private String name;
    private String dosage;

    public MedicationDTO() {}

    public MedicationDTO(String name, String dosage) {
        this.name = name;
        this.dosage = dosage;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
}