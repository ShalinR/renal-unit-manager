package com.peradeniya.renal.service;

import com.peradeniya.renal.dto.HemodialysisInvestigationDto;
import com.peradeniya.renal.model.HemodialysisInvestigation;
import com.peradeniya.renal.repository.HemodialysisInvestigationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HemodialysisInvestigationService {

    @Autowired
    private HemodialysisInvestigationRepository hemodialysisInvestigationRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public List<HemodialysisInvestigationDto> getInvestigationsByPatientId(String patientId) {
        return hemodialysisInvestigationRepository.findByPatientIdOrderByInvestigationDateDesc(patientId)
                .stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    public List<HemodialysisInvestigationDto> getInvestigationsByMonthlyReviewId(Long monthlyReviewId) {
        return hemodialysisInvestigationRepository.findByMonthlyReviewIdOrderByInvestigationDateDesc(monthlyReviewId)
                .stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    public HemodialysisInvestigationDto getInvestigationById(Long id, String patientId) {
        Optional<HemodialysisInvestigation> investigation = hemodialysisInvestigationRepository.findByIdAndPatientId(id, patientId);
        return investigation.map(this::mapEntityToDto).orElse(null);
    }

    public HemodialysisInvestigationDto getInvestigationByIdAndMonthlyReviewId(Long id, Long monthlyReviewId) {
        Optional<HemodialysisInvestigation> investigation = hemodialysisInvestigationRepository.findByIdAndMonthlyReviewId(id, monthlyReviewId);
        return investigation.map(this::mapEntityToDto).orElse(null);
    }

    public HemodialysisInvestigationDto createInvestigation(String patientId, HemodialysisInvestigationDto dto) {
        HemodialysisInvestigation investigation = mapDtoToEntity(dto);
        investigation.setPatientId(patientId);
        HemodialysisInvestigation savedInvestigation = hemodialysisInvestigationRepository.save(investigation);
        return mapEntityToDto(savedInvestigation);
    }

    public HemodialysisInvestigationDto updateInvestigation(Long id, String patientId, HemodialysisInvestigationDto dto) {
        Optional<HemodialysisInvestigation> existingInvestigation = hemodialysisInvestigationRepository.findByIdAndPatientId(id, patientId);
        if (existingInvestigation.isPresent()) {
            HemodialysisInvestigation investigation = existingInvestigation.get();
            // Update fields from DTO
            if (dto.getInvestigationDate() != null) investigation.setInvestigationDate(dto.getInvestigationDate());
            if (dto.getHemoglobin() != null) investigation.setHemoglobin(dto.getHemoglobin());
            if (dto.getHematocrit() != null) investigation.setHematocrit(dto.getHematocrit());
            if (dto.getWhiteBloodCells() != null) investigation.setWhiteBloodCells(dto.getWhiteBloodCells());
            if (dto.getPlatelets() != null) investigation.setPlatelets(dto.getPlatelets());
            if (dto.getUrea() != null) investigation.setUrea(dto.getUrea());
            if (dto.getCreatinine() != null) investigation.setCreatinine(dto.getCreatinine());
            if (dto.getSodium() != null) investigation.setSodium(dto.getSodium());
            if (dto.getPotassium() != null) investigation.setPotassium(dto.getPotassium());
            if (dto.getChloride() != null) investigation.setChloride(dto.getChloride());
            if (dto.getBicarbonate() != null) investigation.setBicarbonate(dto.getBicarbonate());
            if (dto.getCalcium() != null) investigation.setCalcium(dto.getCalcium());
            if (dto.getPhosphate() != null) investigation.setPhosphate(dto.getPhosphate());
            if (dto.getAlbumin() != null) investigation.setAlbumin(dto.getAlbumin());
            if (dto.getTotalProtein() != null) investigation.setTotalProtein(dto.getTotalProtein());
            if (dto.getAlkalinePhosphatase() != null) investigation.setAlkalinePhosphatase(dto.getAlkalinePhosphatase());
            if (dto.getAlanineAminotransferase() != null) investigation.setAlanineAminotransferase(dto.getAlanineAminotransferase());
            if (dto.getAspartateAminotransferase() != null) investigation.setAspartateAminotransferase(dto.getAspartateAminotransferase());
            if (dto.getPH() != null) investigation.setPH(dto.getPH());
            if (dto.getPco2() != null) investigation.setPco2(dto.getPco2());
            if (dto.getPo2() != null) investigation.setPo2(dto.getPo2());
            if (dto.getBicarbonateBloodGas() != null) investigation.setBicarbonateBloodGas(dto.getBicarbonateBloodGas());
            if (dto.getUrineAppearance() != null) investigation.setUrineAppearance(dto.getUrineAppearance());
            if (dto.getUrinePH() != null) investigation.setUrinePH(dto.getUrinePH());
            if (dto.getUrineSpecificGravity() != null) investigation.setUrineSpecificGravity(dto.getUrineSpecificGravity());
            if (dto.getUrineProtein() != null) investigation.setUrineProtein(dto.getUrineProtein());
            if (dto.getUrineGlucose() != null) investigation.setUrineGlucose(dto.getUrineGlucose());
            if (dto.getUrineKetones() != null) investigation.setUrineKetones(dto.getUrineKetones());
            if (dto.getUrineBilirubin() != null) investigation.setUrineBilirubin(dto.getUrineBilirubin());
            if (dto.getUrineBlood() != null) investigation.setUrineBlood(dto.getUrineBlood());
            if (dto.getUrineNitrites() != null) investigation.setUrineNitrites(dto.getUrineNitrites());
            if (dto.getWhiteBloodCellsUrine() != null) investigation.setWhiteBloodCellsUrine(dto.getWhiteBloodCellsUrine());
            if (dto.getRedBloodCellsUrine() != null) investigation.setRedBloodCellsUrine(dto.getRedBloodCellsUrine());
            if (dto.getAbdominalUltrasound() != null) investigation.setAbdominalUltrasound(dto.getAbdominalUltrasound());
            if (dto.getChestXray() != null) investigation.setChestXray(dto.getChestXray());
            if (dto.getEcg() != null) investigation.setEcg(dto.getEcg());
            if (dto.getOtherTests() != null) investigation.setOtherTests(dto.getOtherTests());
            if (dto.getClinicalNotes() != null) investigation.setClinicalNotes(dto.getClinicalNotes());
            if (dto.getPerformedBy() != null) investigation.setPerformedBy(dto.getPerformedBy());
            
            HemodialysisInvestigation updatedInvestigation = hemodialysisInvestigationRepository.save(investigation);
            return mapEntityToDto(updatedInvestigation);
        }
        return null;
    }

    public boolean deleteInvestigation(Long id, String patientId) {
        Optional<HemodialysisInvestigation> investigation = hemodialysisInvestigationRepository.findByIdAndPatientId(id, patientId);
        if (investigation.isPresent()) {
            hemodialysisInvestigationRepository.delete(investigation.get());
            return true;
        }
        return false;
    }

    private HemodialysisInvestigationDto mapEntityToDto(HemodialysisInvestigation entity) {
        HemodialysisInvestigationDto dto = new HemodialysisInvestigationDto();
        dto.setId(entity.getId());
        dto.setPatientId(entity.getPatientId());
        dto.setMonthlyReviewId(entity.getMonthlyReviewId());
        dto.setInvestigationDate(entity.getInvestigationDate());
        dto.setHemoglobin(entity.getHemoglobin());
        dto.setHematocrit(entity.getHematocrit());
        dto.setWhiteBloodCells(entity.getWhiteBloodCells());
        dto.setPlatelets(entity.getPlatelets());
        dto.setUrea(entity.getUrea());
        dto.setCreatinine(entity.getCreatinine());
        dto.setSodium(entity.getSodium());
        dto.setPotassium(entity.getPotassium());
        dto.setChloride(entity.getChloride());
        dto.setBicarbonate(entity.getBicarbonate());
        dto.setCalcium(entity.getCalcium());
        dto.setPhosphate(entity.getPhosphate());
        dto.setAlbumin(entity.getAlbumin());
        dto.setTotalProtein(entity.getTotalProtein());
        dto.setAlkalinePhosphatase(entity.getAlkalinePhosphatase());
        dto.setAlanineAminotransferase(entity.getAlanineAminotransferase());
        dto.setAspartateAminotransferase(entity.getAspartateAminotransferase());
        dto.setPH(entity.getPH());
        dto.setPco2(entity.getPco2());
        dto.setPo2(entity.getPo2());
        dto.setBicarbonateBloodGas(entity.getBicarbonateBloodGas());
        dto.setUrineAppearance(entity.getUrineAppearance());
        dto.setUrinePH(entity.getUrinePH());
        dto.setUrineSpecificGravity(entity.getUrineSpecificGravity());
        dto.setUrineProtein(entity.getUrineProtein());
        dto.setUrineGlucose(entity.getUrineGlucose());
        dto.setUrineKetones(entity.getUrineKetones());
        dto.setUrineBilirubin(entity.getUrineBilirubin());
        dto.setUrineBlood(entity.getUrineBlood());
        dto.setUrineNitrites(entity.getUrineNitrites());
        dto.setWhiteBloodCellsUrine(entity.getWhiteBloodCellsUrine());
        dto.setRedBloodCellsUrine(entity.getRedBloodCellsUrine());
        dto.setAbdominalUltrasound(entity.getAbdominalUltrasound());
        dto.setChestXray(entity.getChestXray());
        dto.setEcg(entity.getEcg());
        dto.setOtherTests(entity.getOtherTests());
        dto.setClinicalNotes(entity.getClinicalNotes());
        dto.setPerformedBy(entity.getPerformedBy());
        dto.setCreatedAt(entity.getCreatedAt() != null ? entity.getCreatedAt().format(FORMATTER) : null);
        dto.setUpdatedAt(entity.getUpdatedAt() != null ? entity.getUpdatedAt().format(FORMATTER) : null);
        return dto;
    }

    private HemodialysisInvestigation mapDtoToEntity(HemodialysisInvestigationDto dto) {
        HemodialysisInvestigation entity = new HemodialysisInvestigation();
        entity.setInvestigationDate(dto.getInvestigationDate());
        entity.setMonthlyReviewId(dto.getMonthlyReviewId());
        entity.setHemoglobin(dto.getHemoglobin());
        entity.setHematocrit(dto.getHematocrit());
        entity.setWhiteBloodCells(dto.getWhiteBloodCells());
        entity.setPlatelets(dto.getPlatelets());
        entity.setUrea(dto.getUrea());
        entity.setCreatinine(dto.getCreatinine());
        entity.setSodium(dto.getSodium());
        entity.setPotassium(dto.getPotassium());
        entity.setChloride(dto.getChloride());
        entity.setBicarbonate(dto.getBicarbonate());
        entity.setCalcium(dto.getCalcium());
        entity.setPhosphate(dto.getPhosphate());
        entity.setAlbumin(dto.getAlbumin());
        entity.setTotalProtein(dto.getTotalProtein());
        entity.setAlkalinePhosphatase(dto.getAlkalinePhosphatase());
        entity.setAlanineAminotransferase(dto.getAlanineAminotransferase());
        entity.setAspartateAminotransferase(dto.getAspartateAminotransferase());
        entity.setPH(dto.getPH());
        entity.setPco2(dto.getPco2());
        entity.setPo2(dto.getPo2());
        entity.setBicarbonateBloodGas(dto.getBicarbonateBloodGas());
        entity.setUrineAppearance(dto.getUrineAppearance());
        entity.setUrinePH(dto.getUrinePH());
        entity.setUrineSpecificGravity(dto.getUrineSpecificGravity());
        entity.setUrineProtein(dto.getUrineProtein());
        entity.setUrineGlucose(dto.getUrineGlucose());
        entity.setUrineKetones(dto.getUrineKetones());
        entity.setUrineBilirubin(dto.getUrineBilirubin());
        entity.setUrineBlood(dto.getUrineBlood());
        entity.setUrineNitrites(dto.getUrineNitrites());
        entity.setWhiteBloodCellsUrine(dto.getWhiteBloodCellsUrine());
        entity.setRedBloodCellsUrine(dto.getRedBloodCellsUrine());
        entity.setAbdominalUltrasound(dto.getAbdominalUltrasound());
        entity.setChestXray(dto.getChestXray());
        entity.setEcg(dto.getEcg());
        entity.setOtherTests(dto.getOtherTests());
        entity.setClinicalNotes(dto.getClinicalNotes());
        entity.setPerformedBy(dto.getPerformedBy());
        return entity;
    }
}
