package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipientAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic patient info stored redundantly for convenience
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

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "dm", column = @Column(name = "recipient_dm")),
            @AttributeOverride(name = "duration", column = @Column(name = "recipient_comorbidity_duration")),
            @AttributeOverride(name = "psychiatricIllness", column = @Column(name = "recipient_psychiatric_illness")),
            @AttributeOverride(name = "htn", column = @Column(name = "recipient_htn")),
            @AttributeOverride(name = "ihd", column = @Column(name = "recipient_ihd"))
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
            @AttributeOverride(name = "dm", column = @Column(name = "recipient_family_dm")),
            @AttributeOverride(name = "htn", column = @Column(name = "recipient_family_htn")),
            @AttributeOverride(name = "ihd", column = @Column(name = "recipient_family_ihd")),
            @AttributeOverride(name = "stroke", column = @Column(name = "recipient_family_stroke")),
            @AttributeOverride(name = "renal", column = @Column(name = "recipient_family_renal"))
    })
    private FamilyHistory familyHistory;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "smoking", column = @Column(name = "recipient_substance_smoking")),
            @AttributeOverride(name = "alcohol", column = @Column(name = "recipient_substance_alcohol")),
            @AttributeOverride(name = "other", column = @Column(name = "recipient_substance_other"))
    })
    private SubstanceUse substanceUse;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "spouseDetails", column = @Column(name = "recipient_spouse_details")),
            @AttributeOverride(name = "childrenDetails", column = @Column(name = "recipient_children_details")),
            @AttributeOverride(name = "income", column = @Column(name = "recipient_social_income")),
            @AttributeOverride(name = "other", column = @Column(name = "recipient_social_other"))
    })
    private SocialHistory socialHistory;

    @Embedded
    private Examination examination;

    @Embedded
    @AttributeOverrides({
            // bloodGroup
            @AttributeOverride(name = "bloodGroup.d", column = @Column(name = "recipient_bg_d")),
            @AttributeOverride(name = "bloodGroup.r", column = @Column(name = "recipient_bg_r")),
            // crossMatch
            @AttributeOverride(name = "crossMatch.tCell", column = @Column(name = "recipient_cross_tcell")),
            @AttributeOverride(name = "crossMatch.bCell", column = @Column(name = "recipient_cross_bcell")),
            // pra
            @AttributeOverride(name = "praPre", column = @Column(name = "recipient_pra_pre")),
            @AttributeOverride(name = "praPost", column = @Column(name = "recipient_pra_post")),
            // dsa and immunologicalRisk
            @AttributeOverride(name = "dsa", column = @Column(name = "recipient_dsa")),
            @AttributeOverride(name = "immunologicalRisk", column = @Column(name = "recipient_immunological_risk")),
            // hlaTyping donor
            @AttributeOverride(name = "hlaTyping.donor.hlaA", column = @Column(name = "recipient_hla_donor_hlaA")),
            @AttributeOverride(name = "hlaTyping.donor.hlaB", column = @Column(name = "recipient_hla_donor_hlaB")),
            @AttributeOverride(name = "hlaTyping.donor.hlaC", column = @Column(name = "recipient_hla_donor_hlaC")),
            @AttributeOverride(name = "hlaTyping.donor.hlaDR", column = @Column(name = "recipient_hla_donor_hlaDR")),
            @AttributeOverride(name = "hlaTyping.donor.hlaDP", column = @Column(name = "recipient_hla_donor_hlaDP")),
            @AttributeOverride(name = "hlaTyping.donor.hlaDQ", column = @Column(name = "recipient_hla_donor_hlaDQ")),
            // hlaTyping recipient
            @AttributeOverride(name = "hlaTyping.recipient.hlaA", column = @Column(name = "recipient_hla_recipient_hlaA")),
            @AttributeOverride(name = "hlaTyping.recipient.hlaB", column = @Column(name = "recipient_hla_recipient_hlaB")),
            @AttributeOverride(name = "hlaTyping.recipient.hlaC", column = @Column(name = "recipient_hla_recipient_hlaC")),
            @AttributeOverride(name = "hlaTyping.recipient.hlaDR", column = @Column(name = "recipient_hla_recipient_hlaDR")),
            @AttributeOverride(name = "hlaTyping.recipient.hlaDP", column = @Column(name = "recipient_hla_recipient_hlaDP")),
            @AttributeOverride(name = "hlaTyping.recipient.hlaDQ", column = @Column(name = "recipient_hla_recipient_hlaDQ")),
            // hlaTyping conclusion
            @AttributeOverride(name = "hlaTyping.conclusion.hlaA", column = @Column(name = "recipient_hla_conclusion_hlaA")),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaB", column = @Column(name = "recipient_hla_conclusion_hlaB")),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaC", column = @Column(name = "recipient_hla_conclusion_hlaC")),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaDR", column = @Column(name = "recipient_hla_conclusion_hlaDR")),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaDP", column = @Column(name = "recipient_hla_conclusion_hlaDP")),
            @AttributeOverride(name = "hlaTyping.conclusion.hlaDQ", column = @Column(name = "recipient_hla_conclusion_hlaDQ"))
    })
    private ImmunologicalDetails immunologicalDetails;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
}
