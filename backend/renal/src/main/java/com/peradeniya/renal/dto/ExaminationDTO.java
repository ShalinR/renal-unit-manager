package com.peradeniya.renal.dto;

public class ExaminationDTO {
    private String height;
    private String weight;
    private String bmi;
    private Boolean pallor;
    private Boolean icterus;
    private OralDTO oral;
    private LymphNodesDTO lymphNodes;
    private Boolean clubbing;
    private Boolean ankleOedema;
    private CvsExamDTO cvs;
    private RespiratoryExamDTO respiratory;
    private AbdomenExamDTO abdomen;
    private String brcostExamination;
    private NeurologicalExamDTO neurologicalExam;

    // Getters and Setters
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

    public Boolean getPallor() {
        return pallor;
    }

    public void setPallor(Boolean pallor) {
        this.pallor = pallor;
    }

    public Boolean getIcterus() {
        return icterus;
    }

    public void setIcterus(Boolean icterus) {
        this.icterus = icterus;
    }

    public OralDTO getOral() {
        return oral;
    }

    public void setOral(OralDTO oral) {
        this.oral = oral;
    }

    public LymphNodesDTO getLymphNodes() {
        return lymphNodes;
    }

    public void setLymphNodes(LymphNodesDTO lymphNodes) {
        this.lymphNodes = lymphNodes;
    }

    public Boolean getClubbing() {
        return clubbing;
    }

    public void setClubbing(Boolean clubbing) {
        this.clubbing = clubbing;
    }

    public Boolean getAnkleOedema() {
        return ankleOedema;
    }

    public void setAnkleOedema(Boolean ankleOedema) {
        this.ankleOedema = ankleOedema;
    }

    public CvsExamDTO getCvs() {
        return cvs;
    }

    public void setCvs(CvsExamDTO cvs) {
        this.cvs = cvs;
    }

    public RespiratoryExamDTO getRespiratory() {
        return respiratory;
    }

    public void setRespiratory(RespiratoryExamDTO respiratory) {
        this.respiratory = respiratory;
    }

    public AbdomenExamDTO getAbdomen() {
        return abdomen;
    }

    public void setAbdomen(AbdomenExamDTO abdomen) {
        this.abdomen = abdomen;
    }

    public String getBrcostExamination() {
        return brcostExamination;
    }

    public void setBrcostExamination(String brcostExamination) {
        this.brcostExamination = brcostExamination;
    }

    public NeurologicalExamDTO getNeurologicalExam() {
        return neurologicalExam;
    }

    public void setNeurologicalExam(NeurologicalExamDTO neurologicalExam) {
        this.neurologicalExam = neurologicalExam;
    }
}