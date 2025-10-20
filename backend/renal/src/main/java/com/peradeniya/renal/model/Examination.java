package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Examination {

    private String height;
    private String weight;

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getBmi() {
        return bmi;
    }

    public void setBmi(String bmi) {
        this.bmi = bmi;
    }

    public boolean isPallor() {
        return pallor;
    }

    public void setPallor(boolean pallor) {
        this.pallor = pallor;
    }

    public boolean isIcterus() {
        return icterus;
    }

    public void setIcterus(boolean icterus) {
        this.icterus = icterus;
    }

    public Oral getOral() {
        return oral;
    }

    public void setOral(Oral oral) {
        this.oral = oral;
    }

    public LymphNodes getLymphNodes() {
        return lymphNodes;
    }

    public void setLymphNodes(LymphNodes lymphNodes) {
        this.lymphNodes = lymphNodes;
    }

    public boolean isClubbing() {
        return clubbing;
    }

    public void setClubbing(boolean clubbing) {
        this.clubbing = clubbing;
    }

    public boolean isAnkleOedema() {
        return ankleOedema;
    }

    public void setAnkleOedema(boolean ankleOedema) {
        this.ankleOedema = ankleOedema;
    }

    public CVSExam getCvs() {
        return cvs;
    }

    public void setCvs(CVSExam cvs) {
        this.cvs = cvs;
    }

    public RespExam getRespiratory() {
        return respiratory;
    }

    public void setRespiratory(RespExam respiratory) {
        this.respiratory = respiratory;
    }

    public AbdomenExam getAbdomen() {
        return abdomen;
    }

    public void setAbdomen(AbdomenExam abdomen) {
        this.abdomen = abdomen;
    }

    public String getBrcostExamination() {
        return brcostExamination;
    }

    public void setBrcostExamination(String brcostExamination) {
        this.brcostExamination = brcostExamination;
    }

    public NeurologicalExam getNeurologicalExam() {
        return neurologicalExam;
    }

    public void setNeurologicalExam(NeurologicalExam neurologicalExam) {
        this.neurologicalExam = neurologicalExam;
    }

    private String bmi;
    private boolean pallor;
    private boolean icterus;

    @Embedded
    private Oral oral;

    @Embedded
    private LymphNodes lymphNodes;

    private boolean clubbing;
    private boolean ankleOedema;

    @Embedded
    private CVSExam cvs;

    @Embedded
    private RespExam respiratory;

    @Embedded
    private AbdomenExam abdomen;

    private String brcostExamination;

    @Embedded
    private NeurologicalExam neurologicalExam;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Oral {
        private boolean dentalCaries;
        private boolean oralHygiene;
        private boolean satisfactory;
        private boolean unsatisfactory;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LymphNodes {
        private boolean cervical;
        private boolean axillary;
        private boolean inguinal;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CVSExam {
        private String bp;
        private String pr;
        private boolean murmurs;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RespExam {
        private String rr;
        private String spo2;
        private boolean auscultation;
        private boolean crepts;
        private boolean ranchi;
        private boolean effusion;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AbdomenExam {
        private boolean hepatomegaly;
        private boolean splenomegaly;
        private boolean renalMasses;
        private boolean freeFluid;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NeurologicalExam {
        private boolean cranialNerves;
        private boolean upperLimb;
        private boolean lowerLimb;
        private boolean coordination;
    }
}
