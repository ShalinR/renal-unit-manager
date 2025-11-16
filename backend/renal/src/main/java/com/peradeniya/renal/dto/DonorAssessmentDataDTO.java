package com.peradeniya.renal.dto;

import java.time.LocalDate;

public class DonorAssessmentDataDTO {
    // Basic donor info
    private String name;



    private String patientPhn;

    private Integer age;
    private String gender;
    private LocalDate dateOfBirth;
    private String occupation;
    private String address;
    private String nicNo;
    private String contactDetails;
    private String emailAddress;

    private String relationToRecipient;
    private String relationType;

    // Comorbidities
    private DonorComorbiditiesDTO comorbidities;

    private String complains;

    // Embedded objects (same as recipient)
    private SystemicInquiryDTO systemicInquiry;
    private String drugHistory;
    private AllergyHistoryDTO allergyHistory;
    private FamilyHistoryDTO familyHistory;
    private SubstanceUseDTO substanceUse;
    private SocialHistoryDTO socialHistory;
    private ExaminationDTO examination;
    private ImmunologicalDetailsDTO immunologicalDetails;
    public String getPatientPhn() {
        return patientPhn;
    }

    public void setPatientPhn(String patientPhn) {
        this.patientPhn = patientPhn;
    }
    // Getters and Setters for all fields
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNicNo() {
        return nicNo;
    }

    public void setNicNo(String nicNo) {
        this.nicNo = nicNo;
    }

    public String getContactDetails() {
        return contactDetails;
    }

    public void setContactDetails(String contactDetails) {
        this.contactDetails = contactDetails;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getRelationToRecipient() {
        return relationToRecipient;
    }

    public void setRelationToRecipient(String relationToRecipient) {
        this.relationToRecipient = relationToRecipient;
    }

    public String getRelationType() {
        return relationType;
    }

    public void setRelationType(String relationType) {
        this.relationType = relationType;
    }

    public DonorComorbiditiesDTO getComorbidities() {
        return comorbidities;
    }

    public void setComorbidities(DonorComorbiditiesDTO comorbidities) {
        this.comorbidities = comorbidities;
    }

    public String getComplains() {
        return complains;
    }

    public void setComplains(String complains) {
        this.complains = complains;
    }

    public SystemicInquiryDTO getSystemicInquiry() {
        return systemicInquiry;
    }

    public void setSystemicInquiry(SystemicInquiryDTO systemicInquiry) {
        this.systemicInquiry = systemicInquiry;
    }

    public String getDrugHistory() {
        return drugHistory;
    }

    public void setDrugHistory(String drugHistory) {
        this.drugHistory = drugHistory;
    }

    public AllergyHistoryDTO getAllergyHistory() {
        return allergyHistory;
    }

    public void setAllergyHistory(AllergyHistoryDTO allergyHistory) {
        this.allergyHistory = allergyHistory;
    }

    public FamilyHistoryDTO getFamilyHistory() {
        return familyHistory;
    }

    public void setFamilyHistory(FamilyHistoryDTO familyHistory) {
        this.familyHistory = familyHistory;
    }

    public SubstanceUseDTO getSubstanceUse() {
        return substanceUse;
    }

    public void setSubstanceUse(SubstanceUseDTO substanceUse) {
        this.substanceUse = substanceUse;
    }

    public SocialHistoryDTO getSocialHistory() {
        return socialHistory;
    }

    public void setSocialHistory(SocialHistoryDTO socialHistory) {
        this.socialHistory = socialHistory;
    }

    public ExaminationDTO getExamination() {
        return examination;
    }

    public void setExamination(ExaminationDTO examination) {
        this.examination = examination;
    }

    public ImmunologicalDetailsDTO getImmunologicalDetails() {
        return immunologicalDetails;
    }

    public void setImmunologicalDetails(ImmunologicalDetailsDTO immunologicalDetails) {
        this.immunologicalDetails = immunologicalDetails;
    }
}