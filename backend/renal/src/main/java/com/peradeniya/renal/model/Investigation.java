package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "investigation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Investigation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String date;

    @Column(nullable = false)
    private String type; // 'frequent' or 'annual'

    // Lab values - frequent tests
    private String tacrolimus;
    private String creatinine;
    private String eGFR;
    private String seNa;
    private String seK;
    private String seHb;
    private String sAlbumin;
    private String urinePCR;

    // Additional annual tests
    private String pcv;
    private String wbcTotal;
    private String wbcN;
    private String wbcL;
    private String platelet;
    private String urineProtein;
    private String urinePusCells;
    private String urineRBC;
    private String sCalcium;
    private String sPhosphate;
    private String fbs;
    private String ppbs;
    private String hba1c;
    private String cholesterolTotal;
    private String triglycerides;
    private String hdl;
    private String ldl;
    private String alp;
    private String uricAcid;
    private String alt;
    private String ast;
    private String sBilirubin;

    // Annual-specific fields
    private String annualScreening;
    private String cmvPCR;
    private String bkvPCR;
    private String ebvPCR;
    private String hepBsAg;
    private String hepCAb;
    private String hivAb;
    private String urineCytology;
    private String pth;
    private String vitD;

    // Imaging
    private String imagingUS_KUB_Pelvis_RenalDoppler;
    private String imagingCXR;
    private String imagingECG;
    private String imaging2DEcho;

    // Hematology & Oncology Screening
    private String hematologyBloodPicture;
    private String breastScreen;
    private String psa;
    private String papSmear;
    private String stoolOccultBlood;

    // Procedures
    private String proceduresEndoscopy;

    // Specialist reviews
    private String specialistDental;
    private String specialistOphthalmology;

    @Column(columnDefinition = "TEXT")
    private String additionalNotes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "patient_phn")
    private Patient patient;
}