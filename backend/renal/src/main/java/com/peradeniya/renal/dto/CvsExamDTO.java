package com.peradeniya.renal.dto;

public class CvsExamDTO {
    private String bp;
    private String pr;
    private Boolean murmurs;

    public String getBp() {
        return bp;
    }

    public void setBp(String bp) {
        this.bp = bp;
    }

    public String getPr() {
        return pr;
    }

    public void setPr(String pr) {
        this.pr = pr;
    }

    public Boolean getMurmurs() {
        return murmurs;
    }

    public void setMurmurs(Boolean murmurs) {
        this.murmurs = murmurs;
    }
}