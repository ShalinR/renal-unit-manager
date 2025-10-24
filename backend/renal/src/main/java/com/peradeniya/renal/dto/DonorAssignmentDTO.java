package com.peradeniya.renal.dto;

public class DonorAssignmentDTO {
    private String donorId;
    private String recipientPhn;
    private String recipientName;
    private String assignmentDate;

    // Getters and Setters
    public String getDonorId() {
        return donorId;
    }

    public void setDonorId(String donorId) {
        this.donorId = donorId;
    }

    public String getRecipientPhn() {
        return recipientPhn;
    }

    public void setRecipientPhn(String recipientPhn) {
        this.recipientPhn = recipientPhn;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getAssignmentDate() {
        return assignmentDate;
    }

    public void setAssignmentDate(String assignmentDate) {
        this.assignmentDate = assignmentDate;
    }
}