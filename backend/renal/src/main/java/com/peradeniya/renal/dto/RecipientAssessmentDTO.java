package com.peradeniya.renal.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RecipientAssessmentDTO {
    private String phn; // Patient PHN to associate with

    // Basic patient info
    private String name;
    private Integer age;
    private String gender;
    private LocalDate dateOfBirth;
    private String occupation;
    private String address;
    private String nicNo;
    private String contactDetails;
    private String emailAddress;

    // Assessment specific fields
    private String donorId;
    private String relationType;
    private String relationToRecipient;

    // Comorbidities
    private Boolean dm;
    private String duration;
    private Boolean psychiatricIllness;
    private Boolean htn;
    private Boolean ihd;

    // Systemic Inquiry
    private SystemicInquiryDTO systemicInquiry;

    private String complains;
    private String drugHistory;
    private AllergyHistoryDTO allergyHistory;
    private FamilyHistoryDTO familyHistory;
    private SubstanceUseDTO substanceUse;
    private SocialHistoryDTO socialHistory;
    private ExaminationDTO examination;
    private ImmunologicalDetailsDTO immunologicalDetails;
}