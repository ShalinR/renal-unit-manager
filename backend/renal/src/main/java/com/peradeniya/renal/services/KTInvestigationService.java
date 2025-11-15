package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.KTInvestigationDTO;
import com.peradeniya.renal.model.KTInvestigation;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.repository.KTInvestigationRepository;
import com.peradeniya.renal.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class KTInvestigationService {

    @Autowired
    private KTInvestigationRepository repository;

    @Autowired
    private PatientRepository patientRepository;

    public KTInvestigationDTO create(String patientPhn, KTInvestigationDTO dto) {
        Optional<Patient> patientOpt = patientRepository.findByPhn(patientPhn);
        if (patientOpt.isEmpty()) {
            throw new RuntimeException("Patient not found: " + patientPhn);
        }

        Patient patient = patientOpt.get();

        KTInvestigation entity = new KTInvestigation();
        entity.setPatient(patient);
        entity.setDate(dto.getDate());
        entity.setType(dto.getType());
        entity.setPayload(dto.getPayload());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        KTInvestigation saved = repository.save(entity);
        return convertToDTO(saved);
    }

    public List<KTInvestigationDTO> getByPatientPhn(String patientPhn) {
        return repository.findByPatientPhn(patientPhn)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<KTInvestigationDTO> getById(Long id) {
        return repository.findById(id).map(this::convertToDTO);
    }

    private KTInvestigationDTO convertToDTO(KTInvestigation e) {
        KTInvestigationDTO dto = new KTInvestigationDTO();
        dto.setId(e.getId());
        dto.setPatientPhn(e.getPatient() != null ? e.getPatient().getPhn() : null);
        dto.setDate(e.getDate());
        dto.setType(e.getType());
        dto.setPayload(e.getPayload());
        dto.setCreatedAt(e.getCreatedAt());
        dto.setUpdatedAt(e.getUpdatedAt());
        return dto;
    }
}
