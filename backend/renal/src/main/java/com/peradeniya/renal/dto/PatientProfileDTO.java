package com.peradeniya.renal.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class PatientProfileDTO {
    private Long patientId;
    private String phn;
    private String name;
    private Integer age;
    private String gender;
    private LocalDate dateOfBirth;
    private String occupation;
    private String address;
    private String nicNo;
    private String contactDetails;
    private String emailAddress;

    // Assessment data
    private RecipientAssessmentResponseDTO recipientAssessment;
    private DonorAssessmentResponseDTO donorAssessment;
    private KTSurgeryDTO ktSurgery;
    private List<FollowUpDTO> followUps;
}