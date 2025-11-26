package com.peradeniya.renal.dto;

public class SystemicInquiryDTO {
    private ConstitutionalDTO constitutional;
    private CvsDTO cvs;
    private RespiratoryDTO respiratory;
    private GitDTO git;
    private RenalDTO renal;
    private NeuroDTO neuro;
    private GynecologyDTO gynecology;
    private String sexualHistory;

    public ConstitutionalDTO getConstitutional() {
        return constitutional;
    }

    public void setConstitutional(ConstitutionalDTO constitutional) {
        this.constitutional = constitutional;
    }

    public CvsDTO getCvs() {
        return cvs;
    }

    public void setCvs(CvsDTO cvs) {
        this.cvs = cvs;
    }

    public RespiratoryDTO getRespiratory() {
        return respiratory;
    }

    public void setRespiratory(RespiratoryDTO respiratory) {
        this.respiratory = respiratory;
    }

    public GitDTO getGit() {
        return git;
    }

    public void setGit(GitDTO git) {
        this.git = git;
    }

    public RenalDTO getRenal() {
        return renal;
    }

    public void setRenal(RenalDTO renal) {
        this.renal = renal;
    }

    public NeuroDTO getNeuro() {
        return neuro;
    }

    public void setNeuro(NeuroDTO neuro) {
        this.neuro = neuro;
    }

    public GynecologyDTO getGynecology() {
        return gynecology;
    }

    public void setGynecology(GynecologyDTO gynecology) {
        this.gynecology = gynecology;
    }

    public String getSexualHistory() {
        return sexualHistory;
    }

    public void setSexualHistory(String sexualHistory) {
        this.sexualHistory = sexualHistory;
    }
}