package com.peradeniya.renal.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "kt_surgery")
public class KTSurgery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_phn", nullable = false)
    private String patientPhn;

    // Patient Information
    @Column(name = "name")
    private String name;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "age")
    private String age;

    @Column(name = "gender")
    private String gender;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "contact")
    private String contact;

    // Medical History
    @Column(name = "diabetes")
    private String diabetes;

    @Column(name = "hypertension")
    private String hypertension;

    @Column(name = "ihd")
    private String ihd;

    @Column(name = "dyslipidaemia")
    private String dyslipidaemia;

    @Column(name = "other")
    private String other;

    @Column(name = "other_specify")
    private String otherSpecify;

    @Column(name = "primary_diagnosis")
    private String primaryDiagnosis;

    @Column(name = "mode_of_rrt")
    private String modeOfRRT;

    @Column(name = "duration_rrt")
    private String durationRRT;

    // Transplantation Details
    @Column(name = "kt_date")
    private LocalDate ktDate;

    @Column(name = "number_of_kt")
    private String numberOfKT;

    @Column(name = "kt_unit")
    private String ktUnit;

    @Column(name = "ward_number")
    private String wardNumber;

    @Column(name = "kt_surgeon")
    private String ktSurgeon;

    @Column(name = "kt_type")
    private String ktType;

    @Column(name = "donor_relationship")
    private String donorRelationship;

    @Column(name = "peritoneal_position")
    private String peritonealPosition;

    @Column(name = "side_of_kt")
    private String sideOfKT;

    // Immunological Details
    @Column(name = "pre_kt")
    private String preKT;

    @Column(name = "induction_therapy")
    private String inductionTherapy;

    @Column(name = "maintenance")
    private String maintenance;

    @Column(name = "maintenance_other")
    private String maintenanceOther;

    // Prophylaxis
    @Column(name = "cotrimoxazole")
    private String cotrimoxazole;

    @Column(name = "cotri_duration")
    private String cotriDuration;

    @Column(name = "cotri_stopped")
    private LocalDate cotriStopped;

    @Column(name = "valganciclovir")
    private String valganciclovir;

    @Column(name = "valgan_duration")
    private String valganDuration;

    @Column(name = "valgan_stopped")
    private LocalDate valganStopped;

    @Column(name = "vaccination")
    private String vaccination;

    // Pre-operative
    @Column(name = "pre_op_status", length = 1000)
    private String preOpStatus;

    @Column(name = "pre_op_preparation", length = 1000)
    private String preOpPreparation;

    @Column(name = "surgical_notes", length = 2000)
    private String surgicalNotes;

    // Immediate Post-Transplant
    @Column(name = "pre_kt_creatinine")
    private String preKTCreatinine;

    @Column(name = "post_kt_creatinine")
    private String postKTCreatinine;

    @Column(name = "delayed_graft")
    private String delayedGraft;

    @Column(name = "post_kt_dialysis")
    private String postKTDialysis;

    @Column(name = "acute_rejection")
    private String acuteRejection;

    @Column(name = "acute_rejection_details")
    private String acuteRejectionDetails;

    @Column(name = "other_complications", length = 1000)
    private String otherComplications;

    // Surgery Complications
    @Column(name = "post_kt_comp1")
    private String postKTComp1;

    @Column(name = "post_kt_comp2")
    private String postKTComp2;

    @Column(name = "post_kt_comp3")
    private String postKTComp3;

    @Column(name = "post_kt_comp4")
    private String postKTComp4;

    @Column(name = "post_kt_comp5")
    private String postKTComp5;

    @Column(name = "post_kt_comp6")
    private String postKTComp6;

    // Current Management
    @Column(name = "current_meds")
    private String currentMeds;

    // Final
    @Column(name = "recommendations", length = 2000)
    private String recommendations;

    @Column(name = "filled_by")
    private String filledBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public KTSurgery() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
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

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

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

    public LocalDate getKtDate() { return ktDate; }
    public void setKtDate(LocalDate ktDate) { this.ktDate = ktDate; }

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

    public String getCotrimoxazole() { return cotrimoxazole; }
    public void setCotrimoxazole(String cotrimoxazole) { this.cotrimoxazole = cotrimoxazole; }

    public String getCotriDuration() { return cotriDuration; }
    public void setCotriDuration(String cotriDuration) { this.cotriDuration = cotriDuration; }

    public LocalDate getCotriStopped() { return cotriStopped; }
    public void setCotriStopped(LocalDate cotriStopped) { this.cotriStopped = cotriStopped; }

    public String getValganciclovir() { return valganciclovir; }
    public void setValganciclovir(String valganciclovir) { this.valganciclovir = valganciclovir; }

    public String getValganDuration() { return valganDuration; }
    public void setValganDuration(String valganDuration) { this.valganDuration = valganDuration; }

    public LocalDate getValganStopped() { return valganStopped; }
    public void setValganStopped(LocalDate valganStopped) { this.valganStopped = valganStopped; }

    public String getVaccination() { return vaccination; }
    public void setVaccination(String vaccination) { this.vaccination = vaccination; }

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

    public String getDelayedGraft() { return delayedGraft; }
    public void setDelayedGraft(String delayedGraft) { this.delayedGraft = delayedGraft; }

    public String getPostKTDialysis() { return postKTDialysis; }
    public void setPostKTDialysis(String postKTDialysis) { this.postKTDialysis = postKTDialysis; }

    public String getAcuteRejection() { return acuteRejection; }
    public void setAcuteRejection(String acuteRejection) { this.acuteRejection = acuteRejection; }

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

    public String getCurrentMeds() { return currentMeds; }
    public void setCurrentMeds(String currentMeds) { this.currentMeds = currentMeds; }

    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }

    public String getFilledBy() { return filledBy; }
    public void setFilledBy(String filledBy) { this.filledBy = filledBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}