package com.peradeniya.renal.dto;

public class HemodialysisInvestigationDto {

    private Long id;
    private String patientId;
    private Long monthlyReviewId;
    private String investigationDate;

    // Blood Tests
    private Double hemoglobin;
    private Double hematocrit;
    private Double whiteBloodCells;
    private Double platelets;
    private Double urea;
    private Double creatinine;
    private Double sodium;
    private Double potassium;
    private Double chloride;
    private Double bicarbonate;
    private Double calcium;
    private Double phosphate;
    private Double albumin;
    private Double totalProtein;
    private Double alkalinePhosphatase;
    private Double alanineAminotransferase;
    private Double aspartateAminotransferase;
    private Double ktV;

    // Blood Gas Analysis
    private Double pH;
    private Double pco2;
    private Double po2;
    private Double bicarbonateBloodGas;

    // Urine Tests
    private String urineAppearance;
    private Double urinePH;
    private Double urineSpecificGravity;
    private Boolean urineProtein;
    private Boolean urineGlucose;
    private Boolean urineKetones;
    private Boolean urineBilirubin;
    private Boolean urineBlood;
    private Boolean urineNitrites;
    private Integer whiteBloodCellsUrine;
    private Integer redBloodCellsUrine;

    // Imaging and Other Tests
    private String abdominalUltrasound;
    private String chestXray;
    private String ecg;
    private String otherTests;

    private String clinicalNotes;
    private String performedBy;
    private String createdAt;
    private String updatedAt;

    // Constructors
    public HemodialysisInvestigationDto() {}

    public HemodialysisInvestigationDto(Long id, String patientId, String investigationDate) {
        this.id = id;
        this.patientId = patientId;
        this.investigationDate = investigationDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public Long getMonthlyReviewId() { return monthlyReviewId; }
    public void setMonthlyReviewId(Long monthlyReviewId) { this.monthlyReviewId = monthlyReviewId; }

    public String getInvestigationDate() { return investigationDate; }
    public void setInvestigationDate(String investigationDate) { this.investigationDate = investigationDate; }

    public Double getHemoglobin() { return hemoglobin; }
    public void setHemoglobin(Double hemoglobin) { this.hemoglobin = hemoglobin; }

    public Double getHematocrit() { return hematocrit; }
    public void setHematocrit(Double hematocrit) { this.hematocrit = hematocrit; }

    public Double getWhiteBloodCells() { return whiteBloodCells; }
    public void setWhiteBloodCells(Double whiteBloodCells) { this.whiteBloodCells = whiteBloodCells; }

    public Double getPlatelets() { return platelets; }
    public void setPlatelets(Double platelets) { this.platelets = platelets; }

    public Double getUrea() { return urea; }
    public void setUrea(Double urea) { this.urea = urea; }

    public Double getCreatinine() { return creatinine; }
    public void setCreatinine(Double creatinine) { this.creatinine = creatinine; }

    public Double getSodium() { return sodium; }
    public void setSodium(Double sodium) { this.sodium = sodium; }

    public Double getPotassium() { return potassium; }
    public void setPotassium(Double potassium) { this.potassium = potassium; }

    public Double getChloride() { return chloride; }
    public void setChloride(Double chloride) { this.chloride = chloride; }

    public Double getBicarbonate() { return bicarbonate; }
    public void setBicarbonate(Double bicarbonate) { this.bicarbonate = bicarbonate; }

    public Double getCalcium() { return calcium; }
    public void setCalcium(Double calcium) { this.calcium = calcium; }

    public Double getPhosphate() { return phosphate; }
    public void setPhosphate(Double phosphate) { this.phosphate = phosphate; }

    public Double getAlbumin() { return albumin; }
    public void setAlbumin(Double albumin) { this.albumin = albumin; }

    public Double getTotalProtein() { return totalProtein; }
    public void setTotalProtein(Double totalProtein) { this.totalProtein = totalProtein; }

    public Double getAlkalinePhosphatase() { return alkalinePhosphatase; }
    public void setAlkalinePhosphatase(Double alkalinePhosphatase) { this.alkalinePhosphatase = alkalinePhosphatase; }

    public Double getAlanineAminotransferase() { return alanineAminotransferase; }
    public void setAlanineAminotransferase(Double alanineAminotransferase) { this.alanineAminotransferase = alanineAminotransferase; }

    public Double getAspartateAminotransferase() { return aspartateAminotransferase; }
    public void setAspartateAminotransferase(Double aspartateAminotransferase) { this.aspartateAminotransferase = aspartateAminotransferase; }

    public Double getKtV() { return ktV; }
    public void setKtV(Double ktV) { this.ktV = ktV; }

    public Double getPH() { return pH; }
    public void setPH(Double pH) { this.pH = pH; }

    public Double getPco2() { return pco2; }
    public void setPco2(Double pco2) { this.pco2 = pco2; }

    public Double getPo2() { return po2; }
    public void setPo2(Double po2) { this.po2 = po2; }

    public Double getBicarbonateBloodGas() { return bicarbonateBloodGas; }
    public void setBicarbonateBloodGas(Double bicarbonateBloodGas) { this.bicarbonateBloodGas = bicarbonateBloodGas; }

    public String getUrineAppearance() { return urineAppearance; }
    public void setUrineAppearance(String urineAppearance) { this.urineAppearance = urineAppearance; }

    public Double getUrinePH() { return urinePH; }
    public void setUrinePH(Double urinePH) { this.urinePH = urinePH; }

    public Double getUrineSpecificGravity() { return urineSpecificGravity; }
    public void setUrineSpecificGravity(Double urineSpecificGravity) { this.urineSpecificGravity = urineSpecificGravity; }

    public Boolean getUrineProtein() { return urineProtein; }
    public void setUrineProtein(Boolean urineProtein) { this.urineProtein = urineProtein; }

    public Boolean getUrineGlucose() { return urineGlucose; }
    public void setUrineGlucose(Boolean urineGlucose) { this.urineGlucose = urineGlucose; }

    public Boolean getUrineKetones() { return urineKetones; }
    public void setUrineKetones(Boolean urineKetones) { this.urineKetones = urineKetones; }

    public Boolean getUrineBilirubin() { return urineBilirubin; }
    public void setUrineBilirubin(Boolean urineBilirubin) { this.urineBilirubin = urineBilirubin; }

    public Boolean getUrineBlood() { return urineBlood; }
    public void setUrineBlood(Boolean urineBlood) { this.urineBlood = urineBlood; }

    public Boolean getUrineNitrites() { return urineNitrites; }
    public void setUrineNitrites(Boolean urineNitrites) { this.urineNitrites = urineNitrites; }

    public Integer getWhiteBloodCellsUrine() { return whiteBloodCellsUrine; }
    public void setWhiteBloodCellsUrine(Integer whiteBloodCellsUrine) { this.whiteBloodCellsUrine = whiteBloodCellsUrine; }

    public Integer getRedBloodCellsUrine() { return redBloodCellsUrine; }
    public void setRedBloodCellsUrine(Integer redBloodCellsUrine) { this.redBloodCellsUrine = redBloodCellsUrine; }

    public String getAbdominalUltrasound() { return abdominalUltrasound; }
    public void setAbdominalUltrasound(String abdominalUltrasound) { this.abdominalUltrasound = abdominalUltrasound; }

    public String getChestXray() { return chestXray; }
    public void setChestXray(String chestXray) { this.chestXray = chestXray; }

    public String getEcg() { return ecg; }
    public void setEcg(String ecg) { this.ecg = ecg; }

    public String getOtherTests() { return otherTests; }
    public void setOtherTests(String otherTests) { this.otherTests = otherTests; }

    public String getClinicalNotes() { return clinicalNotes; }
    public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
