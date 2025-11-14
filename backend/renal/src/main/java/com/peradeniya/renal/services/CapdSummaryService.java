package com.peradeniya.renal.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.peradeniya.renal.dto.AdequacyResultsDto;
import com.peradeniya.renal.dto.CapdSummaryDto;
import com.peradeniya.renal.dto.PetResultsDto;
import com.peradeniya.renal.model.CapdSummaryEntity;
import com.peradeniya.renal.repository.CapdSummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CapdSummaryService {

    private final CapdSummaryRepository repository;
    private final ObjectMapper objectMapper; // Jackson's JSON mapper

    @Autowired
    public CapdSummaryService(CapdSummaryRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    /**
     * Gets a summary by patient ID.
     */
    public CapdSummaryDto getSummaryByPatientId(String patientId) {
        return repository.findByPatientId(patientId)
                .map(this::mapEntityToDto) // If found, map it to a DTO
                .orElse(null); // Otherwise, return null
    }

    /**
     * Saves a summary.
     */
    public CapdSummaryDto saveSummary(String patientId, CapdSummaryDto dto) {
        // Find existing record or create a new one
        CapdSummaryEntity entity = repository.findByPatientId(patientId)
                .orElse(new CapdSummaryEntity());

        // Map DTO data to the entity
        mapDtoToEntity(dto, entity, patientId);

        // Save to database
        CapdSummaryEntity savedEntity = repository.save(entity);

        // Map the saved entity back to a DTO to return
        return mapEntityToDto(savedEntity);
    }

    // --- Helper Methods ---

    /**
     * Maps an Entity from the DB to a DTO for the API.
     */
    private CapdSummaryDto mapEntityToDto(CapdSummaryEntity entity) {
        CapdSummaryDto dto = new CapdSummaryDto();
        dto.setCounsellingDate(entity.getCounsellingDate());
        dto.setCatheterInsertionDate(entity.getCatheterInsertionDate());
        dto.setInsertionDoneBy(entity.getInsertionDoneBy());
        dto.setInsertionPlace(entity.getInsertionPlace());
        dto.setFirstFlushing(entity.getFirstFlushing());
        dto.setSecondFlushing(entity.getSecondFlushing());
        dto.setThirdFlushing(entity.getThirdFlushing());
        dto.setInitiationDate(entity.getInitiationDate());
        dto.setTechnique(entity.getTechnique());
        dto.setDesignation(entity.getDesignation());

        // Deserialize JSON string back into a PetResultsDto object
        try {
            if (entity.getPetResultsJson() != null) {
                PetResultsDto petResults = objectMapper.readValue(entity.getPetResultsJson(), PetResultsDto.class);
                dto.setPetResults(petResults);
            }
        } catch (Exception e) {
            System.err.println("Error deserializing PET results: " + e.getMessage());
        }
        
        // Deserialize JSON string back into an AdequacyResultsDto object
        try {
            if (entity.getAdequacyResultsJson() != null) {
                AdequacyResultsDto adequacyResults = objectMapper.readValue(entity.getAdequacyResultsJson(), AdequacyResultsDto.class);
                dto.setAdequacyResults(adequacyResults);
            }
        } catch (Exception e) {
            System.err.println("Error deserializing Adequacy results: " + e.getMessage());
        }
        
        return dto;
    }

    /**
     * Maps a DTO from the API to an Entity for the DB.
     */
    private void mapDtoToEntity(CapdSummaryDto dto, CapdSummaryEntity entity, String patientId) {
        entity.setPatientId(patientId);
        entity.setCounsellingDate(dto.getCounsellingDate());
        entity.setCatheterInsertionDate(dto.getCatheterInsertionDate());
        entity.setInsertionDoneBy(dto.getInsertionDoneBy());
        entity.setInsertionPlace(dto.getInsertionPlace());
        entity.setFirstFlushing(dto.getFirstFlushing());
        entity.setSecondFlushing(dto.getSecondFlushing());
        entity.setThirdFlushing(dto.getThirdFlushing());
        entity.setInitiationDate(dto.getInitiationDate());
        entity.setTechnique(dto.getTechnique());
        entity.setDesignation(dto.getDesignation());

        // Serialize the PetResultsDto object into a JSON string
        try {
            if (dto.getPetResults() != null) {
                String petResultsJson = objectMapper.writeValueAsString(dto.getPetResults());
                entity.setPetResultsJson(petResultsJson);
            }
        } catch (Exception e) {
            System.err.println("Error serializing PET results: " + e.getMessage());
        }
        
        // Serialize the AdequacyResultsDto object into a JSON string
        try {
            if (dto.getAdequacyResults() != null) {
                String adequacyResultsJson = objectMapper.writeValueAsString(dto.getAdequacyResults());
                entity.setAdequacyResultsJson(adequacyResultsJson);
            }
        } catch (Exception e) {
            System.err.println("Error serializing Adequacy results: " + e.getMessage());
        }
    }
}
