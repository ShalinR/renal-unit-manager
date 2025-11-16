package com.peradeniya.renal.dto;

public class TransfusionHistoryDTO {
    private String date;
    private String indication;
    private String volume;

    // Constructors


    public TransfusionHistoryDTO(String date, String indication, String volume) {
        this.date = date;
        this.indication = indication;
        this.volume = volume;
    }

    // Getters and setters
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getIndication() { return indication; }
    public void setIndication(String indication) { this.indication = indication; }

    public String getVolume() { return volume; }
    public void setVolume(String volume) { this.volume = volume; }
}