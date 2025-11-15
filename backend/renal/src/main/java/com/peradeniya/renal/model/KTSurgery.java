package com.peradeniya.renal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "kt_surgery")
public class KTSurgery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_phn", nullable = false, length = 50)
    private String patientPhn;

    // Patient Information
    @Column(name = "name", length = 255)
    private String name;

    @Column(name = "dob", length = 50)
    private String dob;

    @Column(name = "age", length = 10)
    private String age;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "contact", length = 50)
    private String contact;

    // Medical History
    @Column(name = "diabetes", length = 10)
    private String diabetes;

    @Column(name = "hypertension", length = 10)
    private String hypertension;

    @Column(name = "ihd", length = 10)
    private String ihd;

    @Column(name = "dyslipidaemia", length = 10)
    private String dyslipidaemia;

    @Column(name = "other", length = 10)
    private String other;

    @Column(name = "other_specify", length = 255)
    private String otherSpecify;

    @Column(name = "primary_diagnosis", columnDefinition = "TEXT")
    private String primaryDiagnosis;

    @Column(name = "mode_of_rrt", length = 50)
    private String modeOfRRT;

    @Column(name = "duration_rrt", length = 50)
    private String durationRRT;

    // Transplantation Details
    @Column(name = "kt_date", length = 50)
    private String ktDate;

    @Column(name = "number_of_kt", length = 20)
    private String numberOfKT;

    @Column(name = "kt_unit", length = 50)
    private String ktUnit;

    @Column(name = "ward_number", length = 50)
    private String wardNumber;

    @Column(name = "kt_surgeon", length = 255)
    private String ktSurgeon;

    @Column(name = "kt_type", length = 50)
    private String ktType;

    @Column(name = "donor_relationship", length = 100)
    private String donorRelationship;

    @Column(name = "peritoneal_position", length = 50)
    private String peritonealPosition;

    @Column(name = "side_of_kt", length = 20)
    private String sideOfKT;

    // Immunosuppression
    @Column(name = "pre_kt", length = 50)
    private String preKT;

    @Column(name = "induction_therapy", length = 100)
    private String inductionTherapy;

    @Column(name = "maintenance", length = 100)
    private String maintenance;

    @Column(name = "maintenance_other", length = 255)
    private String maintenanceOther;

    // Maintenance therapy checkboxes
    @Column(name = "maintenance_pred")
    private Boolean maintenancePred = false;

    @Column(name = "maintenance_mmf")
    private Boolean maintenanceMMF = false;

    @Column(name = "maintenance_tac")
    private Boolean maintenanceTac = false;

    @Column(name = "maintenance_everolimus")
    private Boolean maintenanceEverolimus = false;

    @Column(name = "maintenance_other_text", length = 255)
    private String maintenanceOtherText;
    // Immunological Details (Embedded with proper attribute overrides)
    @Embedded
    @AttributeOverrides({
            // Blood Group
            @AttributeOverride(name = "bloodGroup.d", column = @Column(name = "blood_group_donor", length = 10)),
            @AttributeOverride(name = "bloodGroup.r", column = @Column(name = "blood_group_recipient", length = 10)),

            // Cross Match
            @AttributeOverride(name = "crossMatch.tCell", column = @Column(name = "cross_match_tcell", length = 50)),
            @AttributeOverride(name = "crossMatch.bCell", column = @Column(name = "cross_match_bcell", length = 50)),

            // HLA Typing - Donor
            @AttributeOverride(name = "hlaTyping.donor.hlaA", column = @Column(name = "hla_a_donor", length = 100)),
            @AttributeOverride(name = "hlaTyping.donor.hlaB", column = @Column(name = "hla_b_donor", length = 100)),
            @AttributeOverride(name = "hlaTyping.donor.hlaC", column = @Column(name = "hla_c_donor", length = 100)),
            @AttributeOverride(name = "hlaTyping.donor.hlaDR", column = @Column(name = "hla_dr_donor", length = 100)),
            @AttributeOverride(name = "hlaTyping.donor.hlaDP", column = @Column(name = "hla_dp_donor", length = 100)),
            @AttributeOverride(name = "hlaTyping.donor.hlaDQ", column = @Column(name = "hla_dq_donor", length = 100)),

            // HLA Typing - Recipient
            @AttributeOverride(name = "hlaTyping.recipient.hlaA", column = @Column(name = "hla_a_recipient", length = 100)),
            @AttributeOverride(name = "hlaTyping.recipient.hlaB", column = @Column(name = "hla_b_recipient", length = 100)),
            @AttributeOverride(name = "hlaTyping.recipient.hlaC", column = @Column(name = "hla_c_recipient", length = 100)),
            @AttributeOverride(name = "hlaTyping.recipient.hlaDR", column = @Column(name = "hla_dr_recipient", length = 100)),
            @AttributeOverride(name = "hlaTyping.recipient.hlaDP", column = @Column(name = "hla_dp_recipient", length = 100)),
            @AttributeOverride(name = "hlaTyping.recipient.hlaDQ", column = @Column(name = "hla_dq_recipient", length = 100)),

            // HLA Typing - Conclusion
            @AttributeOverride(name = "hlaTyping.conclusion.hlaA", column = @Column(name = "hla_a_conclusion", length = 100)),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaB", column = @Column(name = "hla_b_conclusion", length = 100)),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaC", column = @Column(name = "hla_c_conclusion", length = 100)),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaDR", column = @Column(name = "hla_dr_conclusion", length = 100)),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaDP", column = @Column(name = "hla_dp_conclusion", length = 100)),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaDQ", column = @Column(name = "hla_dq_conclusion", length = 100)),

            // Other immunological fields
            @AttributeOverride(name = "praPre", column = @Column(name = "pra_pre", length = 50)),
            @AttributeOverride(name = "praPost", column = @Column(name = "pra_post", length = 50)),
            @AttributeOverride(name = "dsa", column = @Column(name = "dsa", columnDefinition = "TEXT")),
            @AttributeOverride(name = "immunologicalRisk", column = @Column(name = "immunological_risk", length = 100))
    })
    private ImmunologicalDetails immunologicalDetails;

    @Column(name = "cmv_donor", length = 10)
    private String cmvDonor;

    @Column(name = "cmv_recipient", length = 10)
    private String cmvRecipient;

    @Column(name = "ebv_donor", length = 10)
    private String ebvDonor;

    @Column(name = "ebv_recipient", length = 10)
    private String ebvRecipient;

    @Column(name = "cmv_risk_category", length = 20)
    private String cmvRiskCategory;

    @Column(name = "ebv_risk_category", length = 20)
    private String ebvRiskCategory;

    @Column(name = "tb_mantoux", length = 20)
    private String tbMantoux;

    @Column(name = "hiv_ab", length = 50)
    private String hivAb;

    @Column(name = "hep_bs_ag", length = 50)
    private String hepBsAg;

    @Column(name = "hep_c_ab", length = 50)
    private String hepCAb;

    @Column(name = "infection_risk_category", length = 20)
    private String infectionRiskCategory;

    // Prophylaxis
    @Column(name = "cotrimoxazole_yes")
    private Boolean cotrimoxazoleYes = false;

    @Column(name = "cotri_duration", length = 100)
    private String cotriDuration;

    @Column(name = "cotri_stopped", length = 50)
    private String cotriStopped;

    @Column(name = "valganciclovir_yes")
    private Boolean valganciclovirYes = false;

    @Column(name = "valgan_duration", length = 100)
    private String valganDuration;

    @Column(name = "valgan_stopped", length = 50)
    private String valganStopped;

    // Vaccination checkboxes
    @Column(name = "vaccination_covid")
    private Boolean vaccinationCOVID = false;

    @Column(name = "vaccination_influenza")
    private Boolean vaccinationInfluenza = false;

    @Column(name = "vaccination_pneumococcal")
    private Boolean vaccinationPneumococcal = false;

    @Column(name = "vaccination_varicella")
    private Boolean vaccinationVaricella = false;

    // Pre-operative
    @Column(name = "pre_op_status", columnDefinition = "TEXT")
    private String preOpStatus;

    @Column(name = "pre_op_preparation", columnDefinition = "TEXT")
    private String preOpPreparation;

    @Column(name = "surgical_notes", columnDefinition = "TEXT")
    private String surgicalNotes;

    // Immediate Post-Transplant
    @Column(name = "pre_kt_creatinine", length = 50)
    private String preKTCreatinine;

    @Column(name = "post_kt_creatinine", length = 50)
    private String postKTCreatinine;

    @Column(name = "delayed_graft_yes")
    private Boolean delayedGraftYes = false;

    @Column(name = "post_kt_dialysis_yes")
    private Boolean postKTDialysisYes = false;

    @Column(name = "post_kt_pd_yes")
    private Boolean postKTPDYes = false;

    @Column(name = "acute_rejection_yes")
    private Boolean acuteRejectionYes = false;

    @Column(name = "acute_rejection_details", columnDefinition = "TEXT")
    private String acuteRejectionDetails;

    @Column(name = "other_complications", columnDefinition = "TEXT")
    private String otherComplications;

    // Surgery Complications
    @Column(name = "post_kt_comp1", columnDefinition = "TEXT")
    private String postKTComp1;

    @Column(name = "post_kt_comp2", columnDefinition = "TEXT")
    private String postKTComp2;

    @Column(name = "post_kt_comp3", columnDefinition = "TEXT")
    private String postKTComp3;

    @Column(name = "post_kt_comp4", columnDefinition = "TEXT")
    private String postKTComp4;

    @Column(name = "post_kt_comp5", columnDefinition = "TEXT")
    private String postKTComp5;

    @Column(name = "post_kt_comp6", columnDefinition = "TEXT")
    private String postKTComp6;

    // Medications (as JSON)
    @Column(name = "medications", columnDefinition = "TEXT")
    private String medications;

    // Final
    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "filled_by", length = 255)
    private String filledBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public KTSurgery() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.immunologicalDetails = new ImmunologicalDetails();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientPhn() { return patientPhn; }
    public void setPatientPhn(String patientPhn) { this.patientPhn = patientPhn; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getDiabetes() { return diabetes; }
    public void setDiabetes(String diabetes) { this.diabetes = diabetes; }

    public String getHypertension() { return hypertension; }
    public void setHypertension(String hypertension) { this.hypertension = hypertension; }

    public String getIhd() { return ihd; }
    public void setIhd(String ihd) { this.ihd = ihd; }

    public String getDyslipidaemia() { return dyslipidaemia; }
    public void setDyslipidaemia(String dyslipidaemia) { this.dyslipidaemia = dyslipidaemia; }

    public String getOther() { return other; }
    public void setOther(String other) { this.other = other; }

    public String getOtherSpecify() { return otherSpecify; }
    public void setOtherSpecify(String otherSpecify) { this.otherSpecify = otherSpecify; }

    public String getPrimaryDiagnosis() { return primaryDiagnosis; }
    public void setPrimaryDiagnosis(String primaryDiagnosis) { this.primaryDiagnosis = primaryDiagnosis; }

    public String getModeOfRRT() { return modeOfRRT; }
    public void setModeOfRRT(String modeOfRRT) { this.modeOfRRT = modeOfRRT; }

    public String getDurationRRT() { return durationRRT; }
    public void setDurationRRT(String durationRRT) { this.durationRRT = durationRRT; }

    public String getKtDate() { return ktDate; }
    public void setKtDate(String ktDate) { this.ktDate = ktDate; }

    public String getNumberOfKT() { return numberOfKT; }
    public void setNumberOfKT(String numberOfKT) { this.numberOfKT = numberOfKT; }

    public String getKtUnit() { return ktUnit; }
    public void setKtUnit(String ktUnit) { this.ktUnit = ktUnit; }

    public String getWardNumber() { return wardNumber; }
    public void setWardNumber(String wardNumber) { this.wardNumber = wardNumber; }

    public String getKtSurgeon() { return ktSurgeon; }
    public void setKtSurgeon(String ktSurgeon) { this.ktSurgeon = ktSurgeon; }

    public String getKtType() { return ktType; }
    public void setKtType(String ktType) { this.ktType = ktType; }

    public String getDonorRelationship() { return donorRelationship; }
    public void setDonorRelationship(String donorRelationship) { this.donorRelationship = donorRelationship; }

    public String getPeritonealPosition() { return peritonealPosition; }
    public void setPeritonealPosition(String peritonealPosition) { this.peritonealPosition = peritonealPosition; }

    public String getSideOfKT() { return sideOfKT; }
    public void setSideOfKT(String sideOfKT) { this.sideOfKT = sideOfKT; }

    public String getPreKT() { return preKT; }
    public void setPreKT(String preKT) { this.preKT = preKT; }

    public String getInductionTherapy() { return inductionTherapy; }
    public void setInductionTherapy(String inductionTherapy) { this.inductionTherapy = inductionTherapy; }

    public String getMaintenance() { return maintenance; }
    public void setMaintenance(String maintenance) { this.maintenance = maintenance; }

    public String getMaintenanceOther() { return maintenanceOther; }
    public void setMaintenanceOther(String maintenanceOther) { this.maintenanceOther = maintenanceOther; }

    public Boolean getMaintenancePred() { return maintenancePred; }
    public void setMaintenancePred(Boolean maintenancePred) { this.maintenancePred = maintenancePred; }

    public Boolean getMaintenanceMMF() { return maintenanceMMF; }
    public void setMaintenanceMMF(Boolean maintenanceMMF) { this.maintenanceMMF = maintenanceMMF; }

    public Boolean getMaintenanceTac() { return maintenanceTac; }
    public void setMaintenanceTac(Boolean maintenanceTac) { this.maintenanceTac = maintenanceTac; }

    public Boolean getMaintenanceEverolimus() { return maintenanceEverolimus; }
    public void setMaintenanceEverolimus(Boolean maintenanceEverolimus) { this.maintenanceEverolimus = maintenanceEverolimus; }

    public String getMaintenanceOtherText() { return maintenanceOtherText; }
    public void setMaintenanceOtherText(String maintenanceOtherText) { this.maintenanceOtherText = maintenanceOtherText; }

    public ImmunologicalDetails getImmunologicalDetails() { return immunologicalDetails; }
    public void setImmunologicalDetails(ImmunologicalDetails immunologicalDetails) { this.immunologicalDetails = immunologicalDetails; }

    public String getCmvDonor() { return cmvDonor; }
    public void setCmvDonor(String cmvDonor) { this.cmvDonor = cmvDonor; }

    public String getCmvRecipient() { return cmvRecipient; }
    public void setCmvRecipient(String cmvRecipient) { this.cmvRecipient = cmvRecipient; }

    public String getEbvDonor() { return ebvDonor; }
    public void setEbvDonor(String ebvDonor) { this.ebvDonor = ebvDonor; }

    public String getEbvRecipient() { return ebvRecipient; }
    public void setEbvRecipient(String ebvRecipient) { this.ebvRecipient = ebvRecipient; }

    public String getCmvRiskCategory() { return cmvRiskCategory; }
    public void setCmvRiskCategory(String cmvRiskCategory) { this.cmvRiskCategory = cmvRiskCategory; }

    public String getEbvRiskCategory() { return ebvRiskCategory; }
    public void setEbvRiskCategory(String ebvRiskCategory) { this.ebvRiskCategory = ebvRiskCategory; }

    public String getTbMantoux() { return tbMantoux; }
    public void setTbMantoux(String tbMantoux) { this.tbMantoux = tbMantoux; }

    public String getHivAb() { return hivAb; }
    public void setHivAb(String hivAb) { this.hivAb = hivAb; }

    public String getHepBsAg() { return hepBsAg; }
    public void setHepBsAg(String hepBsAg) { this.hepBsAg = hepBsAg; }

    public String getHepCAb() { return hepCAb; }
    public void setHepCAb(String hepCAb) { this.hepCAb = hepCAb; }

    public String getInfectionRiskCategory() { return infectionRiskCategory; }
    public void setInfectionRiskCategory(String infectionRiskCategory) { this.infectionRiskCategory = infectionRiskCategory; }

    public Boolean getCotrimoxazoleYes() { return cotrimoxazoleYes; }
    public void setCotrimoxazoleYes(Boolean cotrimoxazoleYes) { this.cotrimoxazoleYes = cotrimoxazoleYes; }

    public String getCotriDuration() { return cotriDuration; }
    public void setCotriDuration(String cotriDuration) { this.cotriDuration = cotriDuration; }

    public String getCotriStopped() { return cotriStopped; }
    public void setCotriStopped(String cotriStopped) { this.cotriStopped = cotriStopped; }

    public Boolean getValganciclovirYes() { return valganciclovirYes; }
    public void setValganciclovirYes(Boolean valganciclovirYes) { this.valganciclovirYes = valganciclovirYes; }

    public String getValganDuration() { return valganDuration; }
    public void setValganDuration(String valganDuration) { this.valganDuration = valganDuration; }

    public String getValganStopped() { return valganStopped; }
    public void setValganStopped(String valganStopped) { this.valganStopped = valganStopped; }

    public Boolean getVaccinationCOVID() { return vaccinationCOVID; }
    public void setVaccinationCOVID(Boolean vaccinationCOVID) { this.vaccinationCOVID = vaccinationCOVID; }

    public Boolean getVaccinationInfluenza() { return vaccinationInfluenza; }
    public void setVaccinationInfluenza(Boolean vaccinationInfluenza) { this.vaccinationInfluenza = vaccinationInfluenza; }

    public Boolean getVaccinationPneumococcal() { return vaccinationPneumococcal; }
    public void setVaccinationPneumococcal(Boolean vaccinationPneumococcal) { this.vaccinationPneumococcal = vaccinationPneumococcal; }

    public Boolean getVaccinationVaricella() { return vaccinationVaricella; }
    public void setVaccinationVaricella(Boolean vaccinationVaricella) { this.vaccinationVaricella = vaccinationVaricella; }

    public String getPreOpStatus() { return preOpStatus; }
    public void setPreOpStatus(String preOpStatus) { this.preOpStatus = preOpStatus; }

    public String getPreOpPreparation() { return preOpPreparation; }
    public void setPreOpPreparation(String preOpPreparation) { this.preOpPreparation = preOpPreparation; }

    public String getSurgicalNotes() { return surgicalNotes; }
    public void setSurgicalNotes(String surgicalNotes) { this.surgicalNotes = surgicalNotes; }

    public String getPreKTCreatinine() { return preKTCreatinine; }
    public void setPreKTCreatinine(String preKTCreatinine) { this.preKTCreatinine = preKTCreatinine; }

    public String getPostKTCreatinine() { return postKTCreatinine; }
    public void setPostKTCreatinine(String postKTCreatinine) { this.postKTCreatinine = postKTCreatinine; }

    public Boolean getDelayedGraftYes() { return delayedGraftYes; }
    public void setDelayedGraftYes(Boolean delayedGraftYes) { this.delayedGraftYes = delayedGraftYes; }

    public Boolean getPostKTDialysisYes() { return postKTDialysisYes; }
    public void setPostKTDialysisYes(Boolean postKTDialysisYes) { this.postKTDialysisYes = postKTDialysisYes; }

    public Boolean getPostKTPDYes() { return postKTPDYes; }
    public void setPostKTPDYes(Boolean postKTPDYes) { this.postKTPDYes = postKTPDYes; }

    public Boolean getAcuteRejectionYes() { return acuteRejectionYes; }
    public void setAcuteRejectionYes(Boolean acuteRejectionYes) { this.acuteRejectionYes = acuteRejectionYes; }

    public String getAcuteRejectionDetails() { return acuteRejectionDetails; }
    public void setAcuteRejectionDetails(String acuteRejectionDetails) { this.acuteRejectionDetails = acuteRejectionDetails; }

    public String getOtherComplications() { return otherComplications; }
    public void setOtherComplications(String otherComplications) { this.otherComplications = otherComplications; }

    public String getPostKTComp1() { return postKTComp1; }
    public void setPostKTComp1(String postKTComp1) { this.postKTComp1 = postKTComp1; }

    public String getPostKTComp2() { return postKTComp2; }
    public void setPostKTComp2(String postKTComp2) { this.postKTComp2 = postKTComp2; }

    public String getPostKTComp3() { return postKTComp3; }
    public void setPostKTComp3(String postKTComp3) { this.postKTComp3 = postKTComp3; }

    public String getPostKTComp4() { return postKTComp4; }
    public void setPostKTComp4(String postKTComp4) { this.postKTComp4 = postKTComp4; }

    public String getPostKTComp5() { return postKTComp5; }
    public void setPostKTComp5(String postKTComp5) { this.postKTComp5 = postKTComp5; }

    public String getPostKTComp6() { return postKTComp6; }
    public void setPostKTComp6(String postKTComp6) { this.postKTComp6 = postKTComp6; }

    public String getMedications() { return medications; }
    public void setMedications(String medications) { this.medications = medications; }

    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }

    public String getFilledBy() { return filledBy; }
    public void setFilledBy(String filledBy) { this.filledBy = filledBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}