package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.InfectionTrackingDto;
import com.peradeniya.renal.model.InfectionTrackingEntity;
import com.peradeniya.renal.repository.InfectionTrackingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InfectionTrackingService {

    private final InfectionTrackingRepository repository;

    @Autowired
    public InfectionTrackingService(InfectionTrackingRepository repository) {
        this.repository = repository;
    }

    /**
     * Get all infections for a patient by type
     */
    public List<InfectionTrackingDto> getInfectionsByType(String patientId, String infectionType) {
        List<InfectionTrackingEntity> entities = repository.findByPatientIdAndInfectionTypeOrderByEpisodeDateDesc(patientId, infectionType);
        return entities.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all infections for a patient
     */
    public List<InfectionTrackingDto> getAllInfections(String patientId) {
        List<InfectionTrackingEntity> entities = repository.findByPatientIdOrderByEpisodeDateDesc(patientId);
        return entities.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Save a new infection record
     */
    public InfectionTrackingDto saveInfection(String patientId, InfectionTrackingDto dto) {
        InfectionTrackingEntity entity = new InfectionTrackingEntity();
        mapDtoToEntity(dto, entity, patientId);
        InfectionTrackingEntity savedEntity = repository.save(entity);
        return mapEntityToDto(savedEntity);
    }

    /**
     * Save multiple infection records
     */
    public List<InfectionTrackingDto> saveInfections(String patientId, List<InfectionTrackingDto> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            return List.of();
        }
        return dtos.stream()
                .map(dto -> saveInfection(patientId, dto))
                .collect(Collectors.toList());
    }

    /**
     * Delete all infections for a patient (used when replacing all records)
     */
    public void deleteAllByPatientId(String patientId) {
        List<InfectionTrackingEntity> entities = repository.findByPatientIdOrderByEpisodeDateDesc(patientId);
        repository.deleteAll(entities);
    }

    /**
     * Delete all peritonitis infections for a patient
     */
    public void deletePeritonitisByPatientId(String patientId) {
        List<InfectionTrackingEntity> entities = repository.findByPatientIdAndInfectionTypeOrderByEpisodeDateDesc(patientId, "PERITONITIS");
        repository.deleteAll(entities);
    }

    /**
     * Save only peritonitis infections (deletes existing peritonitis first)
     */
    public List<InfectionTrackingDto> savePeritonitisInfections(String patientId, List<InfectionTrackingDto> dtos) {
        // Delete existing peritonitis records for this patient
        deletePeritonitisByPatientId(patientId);
        
        // Save new peritonitis records
        if (dtos == null || dtos.isEmpty()) {
            return List.of();
        }
        return dtos.stream()
                .map(dto -> {
                    dto.setInfectionType("PERITONITIS");
                    return saveInfection(patientId, dto);
                })
                .collect(Collectors.toList());
    }

    /**
     * Delete all exit site infections for a patient
     */
    public void deleteExitSiteByPatientId(String patientId) {
        List<InfectionTrackingEntity> entities = repository.findByPatientIdAndInfectionTypeOrderByEpisodeDateDesc(patientId, "EXIT_SITE");
        repository.deleteAll(entities);
    }

    /**
     * Save only exit site infections (deletes existing exit site infections first)
     */
    public List<InfectionTrackingDto> saveExitSiteInfections(String patientId, List<InfectionTrackingDto> dtos) {
        // Delete existing exit site records for this patient
        deleteExitSiteByPatientId(patientId);
        
        // Save new exit site records
        if (dtos == null || dtos.isEmpty()) {
            return List.of();
        }
        return dtos.stream()
                .map(dto -> {
                    dto.setInfectionType("EXIT_SITE");
                    return saveInfection(patientId, dto);
                })
                .collect(Collectors.toList());
    }

    /**
     * Delete all tunnel infections for a patient
     */
    public void deleteTunnelByPatientId(String patientId) {
        List<InfectionTrackingEntity> entities = repository.findByPatientIdAndInfectionTypeOrderByEpisodeDateDesc(patientId, "TUNNEL");
        repository.deleteAll(entities);
    }

    /**
     * Save only tunnel infections (deletes existing tunnel infections first)
     */
    public List<InfectionTrackingDto> saveTunnelInfections(String patientId, List<InfectionTrackingDto> dtos) {
        // Delete existing tunnel records for this patient
        deleteTunnelByPatientId(patientId);
        
        // Save new tunnel records
        if (dtos == null || dtos.isEmpty()) {
            return List.of();
        }
        return dtos.stream()
                .map(dto -> {
                    dto.setInfectionType("TUNNEL");
                    return saveInfection(patientId, dto);
                })
                .collect(Collectors.toList());
    }

    // Helper methods
    private InfectionTrackingDto mapEntityToDto(InfectionTrackingEntity entity) {
        InfectionTrackingDto dto = new InfectionTrackingDto();
        dto.setId(entity.getId());
        dto.setPatientId(entity.getPatientId());
        dto.setInfectionType(entity.getInfectionType());
        dto.setEpisodeDate(entity.getEpisodeDate());
        
        // Peritonitis fields
        dto.setCapdFullReports(entity.getCapdFullReports());
        dto.setCapdCulture(entity.getCapdCulture());
        dto.setAntibioticSensitivity(entity.getAntibioticSensitivity());
        dto.setManagementAntibiotic(entity.getManagementAntibiotic());
        dto.setManagementType(entity.getManagementType());
        dto.setManagementDuration(entity.getManagementDuration());
        dto.setOutcome(entity.getOutcome());
        dto.setReasonForPeritonitis(entity.getReasonForPeritonitis());
        dto.setAssessmentByNO(entity.getAssessmentByNO());
        
        // Exit Site fields
        dto.setDateOnset(entity.getDateOnset());
        dto.setNumberOfEpisodes(entity.getNumberOfEpisodes());
        dto.setInvestigationCulture(entity.getInvestigationCulture());
        dto.setInvestigationExitSite(entity.getInvestigationExitSite());
        dto.setInvestigationOther(entity.getInvestigationOther());
        dto.setHospitalizationDuration(entity.getHospitalizationDuration());
        dto.setReasonForInfection(entity.getReasonForInfection());
        dto.setSpecialRemarks(entity.getSpecialRemarks());
        dto.setAssessmentByDoctor(entity.getAssessmentByDoctor());
        
        // Tunnel fields
        dto.setCultureReport(entity.getCultureReport());
        dto.setTreatment(entity.getTreatment());
        dto.setRemarks(entity.getRemarks());
        
        return dto;
    }

    private void mapDtoToEntity(InfectionTrackingDto dto, InfectionTrackingEntity entity, String patientId) {
        entity.setPatientId(patientId);
        entity.setInfectionType(dto.getInfectionType());
        entity.setEpisodeDate(dto.getEpisodeDate());
        
        // Peritonitis fields
        entity.setCapdFullReports(dto.getCapdFullReports());
        entity.setCapdCulture(dto.getCapdCulture());
        entity.setAntibioticSensitivity(dto.getAntibioticSensitivity());
        entity.setManagementAntibiotic(dto.getManagementAntibiotic());
        entity.setManagementType(dto.getManagementType());
        entity.setManagementDuration(dto.getManagementDuration());
        entity.setOutcome(dto.getOutcome());
        entity.setReasonForPeritonitis(dto.getReasonForPeritonitis());
        entity.setAssessmentByNO(dto.getAssessmentByNO());
        
        // Exit Site fields
        entity.setDateOnset(dto.getDateOnset());
        entity.setNumberOfEpisodes(dto.getNumberOfEpisodes());
        entity.setInvestigationCulture(dto.getInvestigationCulture());
        entity.setInvestigationExitSite(dto.getInvestigationExitSite());
        entity.setInvestigationOther(dto.getInvestigationOther());
        entity.setHospitalizationDuration(dto.getHospitalizationDuration());
        entity.setReasonForInfection(dto.getReasonForInfection());
        entity.setSpecialRemarks(dto.getSpecialRemarks());
        entity.setAssessmentByDoctor(dto.getAssessmentByDoctor());
        
        // Tunnel fields
        entity.setCultureReport(dto.getCultureReport());
        entity.setTreatment(dto.getTreatment());
        entity.setRemarks(dto.getRemarks());
    }
}

