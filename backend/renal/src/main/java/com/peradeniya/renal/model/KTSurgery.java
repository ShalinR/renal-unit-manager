package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KTSurgery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    private String name;
    private LocalDate dob;
    private Integer age;
    private String gender;
    private String address;
    private String contact;

    private String diabetes;
    private String hypertension;
    private String ihd;
    private String dyslipidaemia;
    private String other;
    private String otherSpecify;

    private String primaryDiagnosis;
    private String modeOfRRT;
    private String durationRRT;

    private LocalDate ktDate;
    private String numberOfKT;
    private String ktUnit;
    private String wardNumber;
    private String ktSurgeon;
    private String ktType;
    private String donorRelationship;
    private String peritonealPosition;
    private String sideOfKT;

    private String preKT;
    private String inductionTherapy;
    private String maintenance;
    private String maintenanceOther;

    private String cotrimoxazole;
    private String cotriDuration;
    private String cotriStopped;

    private String valganciclovir;
    private String valganDuration;
    private String valganStopped;

    private String vaccination;
    private String preOpStatus;
    private String preOpPreparation;
    @Column(columnDefinition = "TEXT")
    private String surgicalNotes;

    private String preKTCreatinine;
    private String postKTCreatinine;
    private String delayedGraft;
    private String postKTDialysis;
    private String acuteRejection;
    @Column(columnDefinition = "TEXT")
    private String acuteRejectionDetails;

    @Column(columnDefinition = "TEXT")
    private String otherComplications;

    private String postKTComp1;
    private String postKTComp2;
    private String postKTComp3;
    private String postKTComp4;
    private String postKTComp5;
    private String postKTComp6;

    @Column(columnDefinition = "TEXT")
    private String currentMeds;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    private String filledBy;
}
