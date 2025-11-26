package com.peradeniya.renal.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.peradeniya.renal.dto.HDInvestigationSummaryDto;
import com.peradeniya.renal.model.HDInvestigationSummary;
import com.peradeniya.renal.repository.HDInvestigationSummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class HDInvestigationSummaryService {

    private final HDInvestigationSummaryRepository repository;
    private final ObjectMapper objectMapper;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Autowired
    public HDInvestigationSummaryService(HDInvestigationSummaryRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    /**
     * Creates a new HD investigation summary
     */
    public HDInvestigationSummaryDto createSummary(String patientId, HDInvestigationSummaryDto dto) {
        HDInvestigationSummary entity = new HDInvestigationSummary();
        mapDtoToEntity(dto, entity, patientId);
        HDInvestigationSummary savedEntity = repository.save(entity);
        return mapEntityToDto(savedEntity);
    }

    /**
     * Gets all investigation summaries for a patient, ordered by creation date (newest first)
     */
    public List<HDInvestigationSummaryDto> getSummariesByPatientId(String patientId) {
        List<HDInvestigationSummary> summaries = repository.findByPatientIdOrderByCreatedAtDesc(patientId);
        return summaries.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Gets a single investigation summary by ID
     */
    public HDInvestigationSummaryDto getSummaryById(Long id) {
        return repository.findById(id)
                .map(this::mapEntityToDto)
                .orElse(null);
    }

    /**
     * Updates an existing investigation summary
     */
    public HDInvestigationSummaryDto updateSummary(Long id, HDInvestigationSummaryDto dto) {
        HDInvestigationSummary entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("HD Investigation Summary not found with id: " + id));
        
        mapDtoToEntity(dto, entity, entity.getPatientId());
        HDInvestigationSummary savedEntity = repository.save(entity);
        return mapEntityToDto(savedEntity);
    }

    /**
     * Deletes an investigation summary
     */
    public void deleteSummary(Long id) {
        repository.deleteById(id);
    }

    // Helper methods

    private HDInvestigationSummaryDto mapEntityToDto(HDInvestigationSummary entity) {
        HDInvestigationSummaryDto dto = new HDInvestigationSummaryDto();
        dto.setId(entity.getId());
        dto.setPatientId(entity.getPatientId());
        dto.setPatientName(entity.getPatientName());
        dto.setFilledBy(entity.getFilledBy());
        dto.setDoctorsNote(entity.getDoctorsNote());
        
        if (entity.getCreatedAt() != null) {
            dto.setCreatedAt(entity.getCreatedAt().format(formatter));
        }
        if (entity.getUpdatedAt() != null) {
            dto.setUpdatedAt(entity.getUpdatedAt().format(formatter));
        }

        // Deserialize JSON string back to dates and values
        try {
            if (entity.getInvestigationDataJson() != null) {
                Map<String, Object> data = objectMapper.readValue(
                    entity.getInvestigationDataJson(), 
                    new TypeReference<Map<String, Object>>() {}
                );
                
                if (data.containsKey("dates")) {
                    List<String> dates = objectMapper.convertValue(data.get("dates"), new TypeReference<List<String>>() {});
                    dto.setDates(dates);
                }
                
                if (data.containsKey("values")) {
                    Map<String, Map<String, String>> values = objectMapper.convertValue(
                        data.get("values"), 
                        new TypeReference<Map<String, Map<String, String>>>() {}
                    );
                    dto.setValues(values);
                }
            }
        } catch (Exception e) {
            System.err.println("Error deserializing investigation data: " + e.getMessage());
            e.printStackTrace();
        }

        return dto;
    }

    private void mapDtoToEntity(HDInvestigationSummaryDto dto, HDInvestigationSummary entity, String patientId) {
        entity.setPatientId(patientId);
        entity.setPatientName(dto.getPatientName());
        entity.setFilledBy(dto.getFilledBy());
        entity.setDoctorsNote(dto.getDoctorsNote());

        // Serialize dates and values to JSON string
        try {
            Map<String, Object> data = new HashMap<>();
            data.put("dates", dto.getDates());
            data.put("values", dto.getValues());
            
            String investigationDataJson = objectMapper.writeValueAsString(data);
            entity.setInvestigationDataJson(investigationDataJson);
        } catch (Exception e) {
            System.err.println("Error serializing investigation data: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

