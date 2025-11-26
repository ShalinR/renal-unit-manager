package com.peradeniya.renal.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.peradeniya.renal.dto.HemodialysisRecordDto;
import com.peradeniya.renal.model.HemodialysisRecord;
import com.peradeniya.renal.repository.HemodialysisRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class HemodialysisRecordService {

    private final HemodialysisRecordRepository repository;
    private final ObjectMapper objectMapper;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Autowired
    public HemodialysisRecordService(HemodialysisRecordRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    /**
     * Creates a new hemodialysis record
     */
    public HemodialysisRecordDto createRecord(String patientId, HemodialysisRecordDto dto) {
        HemodialysisRecord entity = new HemodialysisRecord();
        mapDtoToEntity(dto, entity, patientId);
        HemodialysisRecord savedEntity = repository.save(entity);
        return mapEntityToDto(savedEntity);
    }

    /**
     * Gets all records for a patient, ordered by session date (newest first)
     */
    public List<HemodialysisRecordDto> getRecordsByPatientId(String patientId) {
        List<HemodialysisRecord> records = repository.findByPatientIdOrderByHemoDialysisSessionDateDesc(patientId);
        return records.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Gets a single record by ID
     */
    public HemodialysisRecordDto getRecordById(Long id) {
        return repository.findById(id)
                .map(this::mapEntityToDto)
                .orElse(null);
    }

    /**
     * Updates an existing record
     */
    public HemodialysisRecordDto updateRecord(Long id, HemodialysisRecordDto dto) {
        HemodialysisRecord entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hemodialysis record not found with id: " + id));
        
        mapDtoToEntity(dto, entity, entity.getPatientId());
        HemodialysisRecord savedEntity = repository.save(entity);
        return mapEntityToDto(savedEntity);
    }

    /**
     * Deletes a record
     */
    public void deleteRecord(Long id) {
        repository.deleteById(id);
    }

    // Helper methods

    private HemodialysisRecordDto mapEntityToDto(HemodialysisRecord entity) {
        HemodialysisRecordDto dto = new HemodialysisRecordDto();
        dto.setId(entity.getId());
        dto.setPatientId(entity.getPatientId());
        dto.setHemoDialysisSessionDate(entity.getHemoDialysisSessionDate());
        dto.setOtherNotes(entity.getOtherNotes());
        dto.setFilledBy(entity.getFilledBy());
        
        if (entity.getCreatedAt() != null) {
            dto.setCreatedAt(entity.getCreatedAt().format(formatter));
        }
        if (entity.getUpdatedAt() != null) {
            dto.setUpdatedAt(entity.getUpdatedAt().format(formatter));
        }

        // Deserialize JSON strings back to Maps
        try {
            if (entity.getPrescriptionJson() != null) {
                Map<String, Object> prescription = objectMapper.readValue(
                    entity.getPrescriptionJson(), 
                    Map.class
                );
                dto.setPrescription(prescription);
            }
        } catch (Exception e) {
            System.err.println("Error deserializing prescription: " + e.getMessage());
        }

        try {
            if (entity.getVascularAccessJson() != null) {
                Map<String, Object> vascularAccess = objectMapper.readValue(
                    entity.getVascularAccessJson(), 
                    Map.class
                );
                dto.setVascularAccess(vascularAccess);
            }
        } catch (Exception e) {
            System.err.println("Error deserializing vascular access: " + e.getMessage());
        }

        try {
            if (entity.getSessionJson() != null) {
                Map<String, Object> session = objectMapper.readValue(
                    entity.getSessionJson(), 
                    Map.class
                );
                dto.setSession(session);
            }
        } catch (Exception e) {
            System.err.println("Error deserializing session: " + e.getMessage());
        }

        return dto;
    }

    private void mapDtoToEntity(HemodialysisRecordDto dto, HemodialysisRecord entity, String patientId) {
        entity.setPatientId(patientId);
        entity.setHemoDialysisSessionDate(dto.getHemoDialysisSessionDate());
        entity.setOtherNotes(dto.getOtherNotes());
        entity.setFilledBy(dto.getFilledBy());

        // Serialize Maps to JSON strings
        try {
            if (dto.getPrescription() != null) {
                String prescriptionJson = objectMapper.writeValueAsString(dto.getPrescription());
                entity.setPrescriptionJson(prescriptionJson);
            }
        } catch (Exception e) {
            System.err.println("Error serializing prescription: " + e.getMessage());
        }

        try {
            if (dto.getVascularAccess() != null) {
                String vascularAccessJson = objectMapper.writeValueAsString(dto.getVascularAccess());
                entity.setVascularAccessJson(vascularAccessJson);
            }
        } catch (Exception e) {
            System.err.println("Error serializing vascular access: " + e.getMessage());
        }

        try {
            if (dto.getSession() != null) {
                String sessionJson = objectMapper.writeValueAsString(dto.getSession());
                entity.setSessionJson(sessionJson);
            }
        } catch (Exception e) {
            System.err.println("Error serializing session: " + e.getMessage());
        }
    }
}

