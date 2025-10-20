package com.peradeniya.renal.dto;

public class HlaTypingDTO {
    private HlaDetailsDTO donor;
    private HlaDetailsDTO recipient;
    private HlaDetailsDTO conclusion;

    public HlaDetailsDTO getDonor() {
        return donor;
    }

    public void setDonor(HlaDetailsDTO donor) {
        this.donor = donor;
    }

    public HlaDetailsDTO getRecipient() {
        return recipient;
    }

    public void setRecipient(HlaDetailsDTO recipient) {
        this.recipient = recipient;
    }

    public HlaDetailsDTO getConclusion() {
        return conclusion;
    }

    public void setConclusion(HlaDetailsDTO conclusion) {
        this.conclusion = conclusion;
    }
}