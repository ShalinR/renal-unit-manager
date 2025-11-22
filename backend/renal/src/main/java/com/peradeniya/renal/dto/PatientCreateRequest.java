package com.peradeniya.renal.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Data
public class PatientCreateRequest {
    private String phn;
    private String name;
    private LocalDate dateOfBirth;
    private String gender;

    private String address;
    private String contactDetails;
    private String nicNo;
    private String mohArea;
    private String ethnicGroup;
    private String religion;
    private String occupation;
    private String maritalStatus;

    // Admission info
    private String ward;
    private String wardNumber;
    private String bedId;
    private LocalDate admissionDate;
    private String admissionTime; // Changed to String to accept "HH:mm" format
    private String admissionType;
    private String consultantName;
    private String referredBy;
    private String primaryDiagnosis;
    private String admittingOfficer;
    private String presentingComplaints;

    // Examinations
    private Double tempC;
    private Double heightCm;
    private Double weightKg;
    private Double bmi;
    private String bloodPressure;
    private Integer heartRate;

    // Problem list
    private String[] medicalProblems;
    private String[] allergyProblems;

    // Helper method to parse admission time to LocalDateTime
    public LocalDateTime getAdmissionTimeAsLocalDateTime() {
        if (admissionTime == null || admissionTime.trim().isEmpty() || admissionDate == null) {
            return null;
        }
        
        try {
            // Handle different time formats
            String timeString = admissionTime.trim();
            
            // If it's already in ISO format with timezone, parse directly
            if (timeString.contains("T")) {
                return LocalDateTime.parse(timeString);
            }
            
            // Handle simple "HH:mm" format
            if (timeString.length() <= 5) {
                // Add seconds if missing
                if (timeString.length() == 5) { // HH:mm
                    timeString = timeString + ":00";
                }
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
                return LocalDateTime.of(admissionDate, java.time.LocalTime.parse(timeString, formatter));
            }
            
            // Default parsing attempt
            return LocalDateTime.parse(admissionDate.toString() + "T" + timeString);
            
        } catch (DateTimeParseException e) {
            System.err.println("Failed to parse admission time: " + admissionTime + ", error: " + e.getMessage());
            return null;
        }
    }
}