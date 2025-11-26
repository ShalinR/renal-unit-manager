package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.MonthlyAssessmentDto;
import com.peradeniya.renal.model.MonthlyAssessmentEntity;
import com.peradeniya.renal.repository.MonthlyAssessmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MonthlyAssessmentService {

    private final MonthlyAssessmentRepository repository;

    @Autowired
    public MonthlyAssessmentService(MonthlyAssessmentRepository repository) {
        this.repository = repository;
    }

    /**
     * Get all assessments for a patient, ordered by date (newest first)
     */
    public List<MonthlyAssessmentDto> getAllAssessmentsByPatientId(String patientId) {
        List<MonthlyAssessmentEntity> entities = repository.findByPatientIdOrderByAssessmentDateDesc(patientId);
        return entities.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Save a new assessment
     */
    public MonthlyAssessmentDto saveAssessment(String patientId, MonthlyAssessmentDto dto) {
        MonthlyAssessmentEntity entity = new MonthlyAssessmentEntity();
        mapDtoToEntity(dto, entity, patientId);
        MonthlyAssessmentEntity savedEntity = repository.save(entity);
        return mapEntityToDto(savedEntity);
    }

    /**
     * Update an existing assessment
     */
    public MonthlyAssessmentDto updateAssessment(String patientId, Long id, MonthlyAssessmentDto dto) {
        MonthlyAssessmentEntity entity = repository.findByIdAndPatientId(id, patientId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));
        mapDtoToEntity(dto, entity, patientId);
        MonthlyAssessmentEntity savedEntity = repository.save(entity);
        return mapEntityToDto(savedEntity);
    }

    /**
     * Delete an assessment
     */
    public void deleteAssessment(String patientId, Long id) {
        MonthlyAssessmentEntity entity = repository.findByIdAndPatientId(id, patientId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));
        repository.delete(entity);
    }

    // Helper methods
    private MonthlyAssessmentDto mapEntityToDto(MonthlyAssessmentEntity entity) {
        MonthlyAssessmentDto dto = new MonthlyAssessmentDto();
        dto.setId(entity.getId());
        dto.setPatientId(entity.getPatientId());
        dto.setAssessmentDate(entity.getAssessmentDate());
        dto.setExitSite(entity.getExitSite());
        dto.setResidualUrineOutput(entity.getResidualUrineOutput());
        dto.setPdBalance(entity.getPdBalance());
        dto.setBodyWeight(entity.getBodyWeight());
        dto.setBloodPressure(entity.getBloodPressure());
        dto.setNumberOfExchanges(entity.getNumberOfExchanges());
        dto.setTotalBalance(entity.getTotalBalance());
        dto.setShortnessOfBreath(entity.getShortnessOfBreath());
        dto.setEdema(entity.getEdema());
        dto.setIvIron(entity.getIvIron());
        dto.setErythropoietin(entity.getErythropoietin());
        dto.setCapdPrescriptionAPDPlan(entity.getCapdPrescriptionAPDPlan());
        dto.setHandWashingTechnique(entity.getHandWashingTechnique());
        dto.setCapdPrescription(entity.getCapdPrescription());
        dto.setCatheterComponentsInOrder(entity.getCatheterComponentsInOrder());
        return dto;
    }

    private void mapDtoToEntity(MonthlyAssessmentDto dto, MonthlyAssessmentEntity entity, String patientId) {
        entity.setPatientId(patientId);
        entity.setAssessmentDate(dto.getAssessmentDate());
        entity.setExitSite(dto.getExitSite());
        entity.setResidualUrineOutput(dto.getResidualUrineOutput());
        entity.setPdBalance(dto.getPdBalance());
        entity.setBodyWeight(dto.getBodyWeight());
        entity.setBloodPressure(dto.getBloodPressure());
        entity.setNumberOfExchanges(dto.getNumberOfExchanges());
        entity.setTotalBalance(dto.getTotalBalance());
        entity.setShortnessOfBreath(dto.getShortnessOfBreath());
        entity.setEdema(dto.getEdema());
        entity.setIvIron(dto.getIvIron());
        entity.setErythropoietin(dto.getErythropoietin());
        entity.setCapdPrescriptionAPDPlan(dto.getCapdPrescriptionAPDPlan());
        entity.setHandWashingTechnique(dto.getHandWashingTechnique());
        entity.setCapdPrescription(dto.getCapdPrescription());
        entity.setCatheterComponentsInOrder(dto.getCatheterComponentsInOrder());
    }
}

