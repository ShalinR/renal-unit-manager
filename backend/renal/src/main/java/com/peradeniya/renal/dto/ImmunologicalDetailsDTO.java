package com.peradeniya.renal.dto;

public class ImmunologicalDetailsDTO {
    private BloodGroupDTO bloodGroup;
    private CrossMatchDTO crossMatch;
    private HlaTypingDTO hlaTyping;
    private String praPre;
    private String praPost;
    private String dsa;
    private String immunologicalRisk;

    public BloodGroupDTO getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroupDTO bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public CrossMatchDTO getCrossMatch() {
        return crossMatch;
    }

    public void setCrossMatch(CrossMatchDTO crossMatch) {
        this.crossMatch = crossMatch;
    }

    public HlaTypingDTO getHlaTyping() {
        return hlaTyping;
    }

    public void setHlaTyping(HlaTypingDTO hlaTyping) {
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