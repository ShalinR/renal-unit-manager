package com.peradeniya.renal.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RecipientAssessmentResponseDTO {
    private Long id;

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

    // Comorbidities - Updated with all fields
    private ComorbiditiesDTO comorbidities;



    // RRT Details
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

    // Patient reference without circular dependency
    private String patientPhn;
}