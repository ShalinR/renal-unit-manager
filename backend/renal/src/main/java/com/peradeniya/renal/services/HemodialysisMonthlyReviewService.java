package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.HemodialysisMonthlyReviewDto;
import com.peradeniya.renal.model.HemodialysisMonthlyReview;
import com.peradeniya.renal.repository.HemodialysisMonthlyReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HemodialysisMonthlyReviewService {

    private final HemodialysisMonthlyReviewRepository repository;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Autowired
    public HemodialysisMonthlyReviewService(HemodialysisMonthlyReviewRepository repository) {
        this.repository = repository;
    }

    /**
     * Get all monthly reviews for a patient, ordered by review date (newest first)
     */
    public List<HemodialysisMonthlyReviewDto> getReviewsByPatientId(String patientId) {
        List<HemodialysisMonthlyReview> reviews = repository.findByPatientIdOrderByReviewDateDesc(patientId);
        return reviews.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get a single review by ID
     */
    public HemodialysisMonthlyReviewDto getReviewById(String patientId, Long id) {
        return repository.findByIdAndPatientId(id, patientId)
                .map(this::mapEntityToDto)
                .orElse(null);
    }

    /**
     * Create a new monthly review
     */
    public HemodialysisMonthlyReviewDto createReview(String patientId, HemodialysisMonthlyReviewDto dto) {
        HemodialysisMonthlyReview entity = new HemodialysisMonthlyReview();
        mapDtoToEntity(dto, entity, patientId);
        HemodialysisMonthlyReview savedEntity = repository.save(entity);
        return mapEntityToDto(savedEntity);
    }

    /**
     * Update an existing monthly review
     */
    public HemodialysisMonthlyReviewDto updateReview(String patientId, Long id, HemodialysisMonthlyReviewDto dto) {
        HemodialysisMonthlyReview entity = repository.findByIdAndPatientId(id, patientId)
                .orElseThrow(() -> new RuntimeException("Monthly review not found with id: " + id));
        
        mapDtoToEntity(dto, entity, patientId);
        HemodialysisMonthlyReview savedEntity = repository.save(entity);
        return mapEntityToDto(savedEntity);
    }

    /**
     * Delete a monthly review
     */
    public void deleteReview(String patientId, Long id) {
        HemodialysisMonthlyReview entity = repository.findByIdAndPatientId(id, patientId)
                .orElseThrow(() -> new RuntimeException("Monthly review not found with id: " + id));
        repository.delete(entity);
    }

    // Helper methods
    private HemodialysisMonthlyReviewDto mapEntityToDto(HemodialysisMonthlyReview entity) {
        HemodialysisMonthlyReviewDto dto = new HemodialysisMonthlyReviewDto();
        dto.setId(entity.getId());
        dto.setPatientId(entity.getPatientId());
        dto.setReviewDate(entity.getReviewDate());
        dto.setExitSiteCondition(entity.getExitSiteCondition());
        dto.setResidualUrineOutput(entity.getResidualUrineOutput());
        dto.setBodyWeight(entity.getBodyWeight());
        dto.setBloodPressure(entity.getBloodPressure());
        dto.setClinicalAssessment(entity.getClinicalAssessment());
        dto.setDoctorNotes(entity.getDoctorNotes());
        dto.setTreatmentPlan(entity.getTreatmentPlan());
        dto.setReviewedBy(entity.getReviewedBy());
        
        if (entity.getCreatedAt() != null) {
            dto.setCreatedAt(entity.getCreatedAt().format(formatter));
        }
        if (entity.getUpdatedAt() != null) {
            dto.setUpdatedAt(entity.getUpdatedAt().format(formatter));
        }
        
        return dto;
    }

    private void mapDtoToEntity(HemodialysisMonthlyReviewDto dto, HemodialysisMonthlyReview entity, String patientId) {
        entity.setPatientId(patientId);
        entity.setReviewDate(dto.getReviewDate());
        entity.setExitSiteCondition(dto.getExitSiteCondition());
        entity.setResidualUrineOutput(dto.getResidualUrineOutput());
        entity.setBodyWeight(dto.getBodyWeight());
        entity.setBloodPressure(dto.getBloodPressure());
        entity.setClinicalAssessment(dto.getClinicalAssessment());
        entity.setDoctorNotes(dto.getDoctorNotes());
        entity.setTreatmentPlan(dto.getTreatmentPlan());
        entity.setReviewedBy(dto.getReviewedBy());
    }
}
