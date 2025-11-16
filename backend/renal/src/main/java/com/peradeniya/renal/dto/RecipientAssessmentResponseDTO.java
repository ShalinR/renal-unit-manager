package com.peradeniya.renal.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

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
    private ComorbiditiesDTO comorbidities = new ComorbiditiesDTO();
    private RRTDetailsDTO rrtDetails = new RRTDetailsDTO();
    private SystemicInquiryDTO systemicInquiry = new SystemicInquiryDTO();
    private String complains;
    private String drugHistory;
    private AllergyHistoryDTO allergyHistory = new AllergyHistoryDTO();
    private FamilyHistoryDTO familyHistory = new FamilyHistoryDTO();
    private SubstanceUseDTO substanceUse = new SubstanceUseDTO();
    private SocialHistoryDTO socialHistory = new SocialHistoryDTO();
    private ExaminationDTO examination = new ExaminationDTO();
    private ImmunologicalDetailsDTO immunologicalDetails = new ImmunologicalDetailsDTO();
    private CompletedByDTO completedBy = new CompletedByDTO();
    private ReviewedByDTO reviewedBy = new ReviewedByDTO();
    private List<TransfusionHistoryDTO> transfusionHistory;

    // Add getter and setter
    public List<TransfusionHistoryDTO> getTransfusionHistory() {
        return transfusionHistory;
    }

    public void setTransfusionHistory(List<TransfusionHistoryDTO> transfusionHistory) {
        this.transfusionHistory = transfusionHistory;
    }
    private String patientPhn;
}