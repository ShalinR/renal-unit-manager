package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.PatientRegistrationDto;
import com.peradeniya.renal.model.PeriPatientRegistrationEntity;
import com.peradeniya.renal.repository.PatientRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientRegistrationService {

    private final PatientRegistrationRepository repository;

    @Autowired
    public PatientRegistrationService(PatientRegistrationRepository repository) {
        this.repository = repository;
    }

    /**
     * Gets patient registration by patient ID.
     */
    public PatientRegistrationDto getPatientRegistrationByPatientId(String patientId) {
        return repository.findByPatientId(patientId)
                .map(this::mapEntityToDto)
                .orElse(null);
    }

    /**
     * Saves or updates patient registration.
     */
    public PatientRegistrationDto savePatientRegistration(String patientId, PatientRegistrationDto dto) {
        // Find existing record or create a new one
        PeriPatientRegistrationEntity entity = repository.findByPatientId(patientId)
                .orElse(new PeriPatientRegistrationEntity());

        // Map DTO data to the entity
        mapDtoToEntity(dto, entity, patientId);

        // Save to database
        PeriPatientRegistrationEntity savedEntity = repository.save(entity);

        // Map the saved entity back to a DTO to return
        return mapEntityToDto(savedEntity);
    }

    // --- Helper Methods ---

    /**
     * Maps an Entity from the DB to a DTO for the API.
     */
    private PatientRegistrationDto mapEntityToDto(PeriPatientRegistrationEntity entity) {
        PatientRegistrationDto dto = new PatientRegistrationDto();
        dto.setCounsellingDate(entity.getCounsellingDate());
        dto.setInitiationDate(entity.getInitiationDate());
        dto.setCatheterInsertionDate(entity.getCatheterInsertionDate());
        dto.setInsertionDoneBy(entity.getInsertionDoneBy());
        dto.setDesignation(entity.getDesignation());
        dto.setTechnique(entity.getTechnique());
        dto.setInsertionPlace(entity.getInsertionPlace());
        dto.setFirstFlushing(entity.getFirstFlushing());
        dto.setSecondFlushing(entity.getSecondFlushing());
        dto.setThirdFlushing(entity.getThirdFlushing());
        return dto;
    }

    /**
     * Maps a DTO from the API to an Entity for the DB.
     */
    private void mapDtoToEntity(PatientRegistrationDto dto, PeriPatientRegistrationEntity entity, String patientId) {
        entity.setPatientId(patientId);
        entity.setCounsellingDate(dto.getCounsellingDate());
        entity.setInitiationDate(dto.getInitiationDate());
        entity.setCatheterInsertionDate(dto.getCatheterInsertionDate());
        entity.setInsertionDoneBy(dto.getInsertionDoneBy());
        entity.setDesignation(dto.getDesignation());
        entity.setTechnique(dto.getTechnique());
        entity.setInsertionPlace(dto.getInsertionPlace());
        entity.setFirstFlushing(dto.getFirstFlushing());
        entity.setSecondFlushing(dto.getSecondFlushing());
        entity.setThirdFlushing(dto.getThirdFlushing());
    }
}


















