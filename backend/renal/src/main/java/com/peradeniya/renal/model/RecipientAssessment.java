package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "recipient_assessment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipientAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic patient info - CONVERT LARGE FIELDS TO TEXT
    @Column(length = 100)
    private String name;

    private Integer age;

    @Column(length = 20)
    private String gender;

    private LocalDate dateOfBirth;

    @Column(length = 100)
    private String occupation;

    @Column(columnDefinition = "TEXT")  // Address can be long
    private String address;

    @Column(length = 20)
    private String nicNo;

    @Column(columnDefinition = "TEXT")  // Contact details can be multiple lines
    private String contactDetails;

    @Column(length = 100)
    private String emailAddress;

    @Column(length = 50)
    private String donorId;

    @Column(length = 50)
    private String relationType;

    @Column(length = 100)
    private String relationToRecipient;

    @Embedded
    private RRTDetails rrtDetails;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "dm", column = @Column(name = "recipient_dm")),
            @AttributeOverride(name = "duration", column = @Column(name = "recipient_comorbidity_duration", columnDefinition = "TEXT")), // CONVERT TO TEXT
            @AttributeOverride(name = "psychiatricIllness", column = @Column(name = "recipient_psychiatric_illness")),
            @AttributeOverride(name = "htn", column = @Column(name = "recipient_htn")),
            @AttributeOverride(name = "ihd", column = @Column(name = "recipient_ihd")),
            // Microvascular complications
            @AttributeOverride(name = "retinopathy", column = @Column(name = "recipient_retinopathy")),
            @AttributeOverride(name = "nephropathy", column = @Column(name = "recipient_nephropathy")),
            @AttributeOverride(name = "neuropathy", column = @Column(name = "recipient_neuropathy")),
            // Macrovascular complications
            @AttributeOverride(name = "twoDEcho", column = @Column(name = "recipient_two_d_echo", columnDefinition = "TEXT")), // CONVERT TO TEXT
            @AttributeOverride(name = "coronaryAngiogram", column = @Column(name = "recipient_coronary_angiogram", columnDefinition = "TEXT")), // CONVERT TO TEXT
            @AttributeOverride(name = "cva", column = @Column(name = "recipient_cva")),
            @AttributeOverride(name = "pvd", column = @Column(name = "recipient_pvd")),
            // Other comorbidities
            @AttributeOverride(name = "dl", column = @Column(name = "recipient_dl")),
            @AttributeOverride(name = "clcd", column = @Column(name = "recipient_clcd")),
            @AttributeOverride(name = "childClass", column = @Column(name = "recipient_child_class", columnDefinition = "TEXT")), // CONVERT TO TEXT
            @AttributeOverride(name = "meldScore", column = @Column(name = "recipient_meld_score", columnDefinition = "TEXT")), // CONVERT TO TEXT
            @AttributeOverride(name = "hf", column = @Column(name = "recipient_hf"))
    })
    private Comorbidities comorbidities;

    @Column(columnDefinition = "TEXT")
    private String complains;

    @Embedded
    private SystemicInquiry systemicInquiry;

    @Column(columnDefinition = "TEXT")
    private String drugHistory;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "foods", column = @Column(name = "recipient_allergy_foods")),
            @AttributeOverride(name = "drugs", column = @Column(name = "recipient_allergy_drugs")),
            @AttributeOverride(name = "p", column = @Column(name = "recipient_allergy_p"))
    })
    private AllergyHistory allergyHistory;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "dm", column = @Column(name = "recipient_family_dm", columnDefinition = "TEXT")), // CONVERT TO TEXT
            @AttributeOverride(name = "htn", column = @Column(name = "recipient_family_htn", columnDefinition = "TEXT")), // CONVERT TO TEXT
            @AttributeOverride(name = "ihd", column = @Column(name = "recipient_family_ihd", columnDefinition = "TEXT")), // CONVERT TO TEXT
            @AttributeOverride(name = "stroke", column = @Column(name = "recipient_family_stroke", columnDefinition = "TEXT")), // CONVERT TO TEXT
            @AttributeOverride(name = "renal", column = @Column(name = "recipient_family_renal", columnDefinition = "TEXT")) // CONVERT TO TEXT
    })
    private FamilyHistory familyHistory;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "smoking", column = @Column(name = "recipient_substance_smoking")),
            @AttributeOverride(name = "alcohol", column = @Column(name = "recipient_substance_alcohol")),
            @AttributeOverride(name = "other", column = @Column(name = "recipient_substance_other", columnDefinition = "TEXT")) // CONVERT TO TEXT
    })
    private SubstanceUse substanceUse;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "spouseDetails", column = @Column(name = "recipient_spouse_details", columnDefinition = "TEXT")), // CONVERT TO TEXT
            @AttributeOverride(name = "childrenDetails", column = @Column(name = "recipient_children_details", columnDefinition = "TEXT")), // CONVERT TO TEXT
            @AttributeOverride(name = "income", column = @Column(name = "recipient_social_income", columnDefinition = "TEXT")), // CONVERT TO TEXT
            @AttributeOverride(name = "other", column = @Column(name = "recipient_social_other", columnDefinition = "TEXT")) // CONVERT TO TEXT
    })
    private SocialHistory socialHistory;

    @Embedded
    private Examination examination;

    @Embedded
    @AttributeOverrides({
            // bloodGroup
            @AttributeOverride(name = "bloodGroup.d", column = @Column(name = "recipient_bg_d", length = 10)), // REDUCE LENGTH
            @AttributeOverride(name = "bloodGroup.r", column = @Column(name = "recipient_bg_r", length = 10)), // REDUCE LENGTH
            // crossMatch
            @AttributeOverride(name = "crossMatch.tCell", column = @Column(name = "recipient_cross_tcell", length = 50)),
            @AttributeOverride(name = "crossMatch.bCell", column = @Column(name = "recipient_cross_bcell", length = 50)),
            // pra
            @AttributeOverride(name = "praPre", column = @Column(name = "recipient_pra_pre", length = 50)),
            @AttributeOverride(name = "praPost", column = @Column(name = "recipient_pra_post", length = 50)),
            // dsa and immunologicalRisk
            @AttributeOverride(name = "dsa", column = @Column(name = "recipient_dsa", length = 50)),
            @AttributeOverride(name = "immunologicalRisk", column = @Column(name = "recipient_immunological_risk", length = 50)),
            // hlaTyping donor - REDUCE LENGTHS
            @AttributeOverride(name = "hlaTyping.donor.hlaA", column = @Column(name = "recipient_hla_donor_hlaA", length = 100)),
            @AttributeOverride(name = "hlaTyping.donor.hlaB", column = @Column(name = "recipient_hla_donor_hlaB", length = 100)),
            @AttributeOverride(name = "hlaTyping.donor.hlaC", column = @Column(name = "recipient_hla_donor_hlaC", length = 100)),
            @AttributeOverride(name = "hlaTyping.donor.hlaDR", column = @Column(name = "recipient_hla_donor_hlaDR", length = 100)),
            @AttributeOverride(name = "hlaTyping.donor.hlaDP", column = @Column(name = "recipient_hla_donor_hlaDP", length = 100)),
            @AttributeOverride(name = "hlaTyping.donor.hlaDQ", column = @Column(name = "recipient_hla_donor_hlaDQ", length = 100)),
            // hlaTyping recipient - REDUCE LENGTHS
            @AttributeOverride(name = "hlaTyping.recipient.hlaA", column = @Column(name = "recipient_hla_recipient_hlaA", length = 100)),
            @AttributeOverride(name = "hlaTyping.recipient.hlaB", column = @Column(name = "recipient_hla_recipient_hlaB", length = 100)),
            @AttributeOverride(name = "hlaTyping.recipient.hlaC", column = @Column(name = "recipient_hla_recipient_hlaC", length = 100)),
            @AttributeOverride(name = "hlaTyping.recipient.hlaDR", column = @Column(name = "recipient_hla_recipient_hlaDR", length = 100)),
            @AttributeOverride(name = "hlaTyping.recipient.hlaDP", column = @Column(name = "recipient_hla_recipient_hlaDP", length = 100)),
            @AttributeOverride(name = "hlaTyping.recipient.hlaDQ", column = @Column(name = "recipient_hla_recipient_hlaDQ", length = 100)),
            // hlaTyping conclusion - REDUCE LENGTHS
            @AttributeOverride(name = "hlaTyping.conclusion.hlaA", column = @Column(name = "recipient_hla_conclusion_hlaA", length = 100)),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaB", column = @Column(name = "recipient_hla_conclusion_hlaB", length = 100)),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaC", column = @Column(name = "recipient_hla_conclusion_hlaC", length = 100)),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaDR", column = @Column(name = "recipient_hla_conclusion_hlaDR", length = 100)),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaDP", column = @Column(name = "recipient_hla_conclusion_hlaDP", length = 100)),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaDQ", column = @Column(name = "recipient_hla_conclusion_hlaDQ", length = 100))
    })
    private ImmunologicalDetails immunologicalDetails;

    // Medical Staff Information
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "staffName", column = @Column(name = "completed_by_staff_name", length = 100)),
            @AttributeOverride(name = "staffRole", column = @Column(name = "completed_by_staff_role", length = 100)),
            @AttributeOverride(name = "staffId", column = @Column(name = "completed_by_staff_id", length = 50)),
            @AttributeOverride(name = "department", column = @Column(name = "completed_by_department", length = 100)),
            @AttributeOverride(name = "signature", column = @Column(name = "completed_by_signature", length = 100)),
            @AttributeOverride(name = "completionDate", column = @Column(name = "completed_by_date"))
    })
    private CompletedBy completedBy;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "consultantName", column = @Column(name = "reviewed_by_consultant_name", length = 100)),
            @AttributeOverride(name = "consultantId", column = @Column(name = "reviewed_by_consultant_id", length = 50)),
            @AttributeOverride(name = "reviewDate", column = @Column(name = "reviewed_by_date")),
            @AttributeOverride(name = "approvalStatus", column = @Column(name = "reviewed_by_status", length = 50)),
            @AttributeOverride(name = "notes", column = @Column(name = "reviewed_by_notes", columnDefinition = "TEXT")) // CONVERT TO TEXT
    })
    private ReviewedBy reviewedBy;

    // ✅ CORRECT: transfusionHistory is a COLLECTION, so it uses @ElementCollection
    @ElementCollection
    @CollectionTable(
            name = "recipient_transfusion_history",
            joinColumns = @JoinColumn(name = "recipient_assessment_id")
    )
    @AttributeOverrides({
            @AttributeOverride(name = "date", column = @Column(name = "transfusion_date")),
            @AttributeOverride(name = "indication", column = @Column(name = "transfusion_indication", columnDefinition = "TEXT")),
            @AttributeOverride(name = "volume", column = @Column(name = "transfusion_volume", length = 50))
    })
    private List<TransfusionHistory> transfusionHistory;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
}