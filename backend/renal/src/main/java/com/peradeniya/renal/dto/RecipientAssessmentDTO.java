package com.peradeniya.renal.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RecipientAssessmentDTO {
    private Long id; // ADD THIS FOR UPDATES

    private String phn; // For finding patient

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

    private String donorId;
    private String relationType;
    private String relationToRecipient;

    // Comorbidities - UPDATED STRUCTURE
    private ComorbiditiesDTO comorbidities;

    // RRT Details - NEW STRUCTURE
    private RRTDetailsDTO rrtDetails;

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