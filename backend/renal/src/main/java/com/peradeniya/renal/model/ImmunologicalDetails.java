package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImmunologicalDetails {

    @Embedded
    private BloodGroup bloodGroup;

    @Embedded
    private CrossMatch crossMatch;

    @Embedded
    private HLATyping hlaTyping;

    private String praPre;
    private String praPost;
    private String dsa;
    private String immunologicalRisk;


    // ... your embedded classes (BloodGroup, CrossMatch, HLATyping, HLADetails)
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BloodGroup {
        private String d;
        private String r;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CrossMatch {
        private String tCell;
        private String bCell;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HLATyping {
        @Embedded
        private HLADetails donor;
        @Embedded
        private HLADetails recipient;
        @Embedded
        private HLADetails conclusion;

        @Embeddable
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class HLADetails {
            @Column(length = 100)  // Add this annotation

            private String hlaA;
            @Column(length = 100)  // Add this annotation

            private String hlaB;
            @Column(length = 100)  // Add this annotation

            private String hlaC;
            @Column(length = 100)  // Add this annotation

            private String hlaDR;
            @Column(length = 100)  // Add this annotation

            private String hlaDP;
            @Column(length = 100)  // Add this annotation

            private String hlaDQ;
        }
    }

    // Explicit getters/setters if Lombok isn't working
    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public CrossMatch getCrossMatch() {
        return crossMatch;
    }

    public void setCrossMatch(CrossMatch crossMatch) {
        this.crossMatch = crossMatch;
    }

    public HLATyping getHlaTyping() {
        return hlaTyping;
    }

    public void setHlaTyping(HLATyping hlaTyping) {
        this.hlaTyping = hlaTyping;
    }

    public String getPraPre() {
        return praPre;
    }

    public void setPraPre(String praPre) {
        this.praPre = praPre;
    }

    public String getPraPost() {
        return praPost;
    }

    public void setPraPost(String praPost) {
        this.praPost = praPost;
    }

    public String getDsa() {
        return dsa;
    }

    public void setDsa(String dsa) {
        this.dsa = dsa;
    }

    public String getImmunologicalRisk() {
        return immunologicalRisk;
    }

    public void setImmunologicalRisk(String immunologicalRisk) {
        this.immunologicalRisk = immunologicalRisk;
    }

}