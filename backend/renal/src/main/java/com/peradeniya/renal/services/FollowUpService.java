package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.FollowUpDTO;
import com.peradeniya.renal.model.FollowUp;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.repository.FollowUpRepository;
import com.peradeniya.renal.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FollowUpService {

    @Autowired
    private FollowUpRepository repository;

    @Autowired
    private PatientRepository patientRepository;

    public FollowUpDTO create(String patientPhn, FollowUpDTO dto) {
        Optional<Patient> patientOpt = patientRepository.findByPhn(patientPhn);
        if (patientOpt.isEmpty()) {
            throw new RuntimeException("Patient not found: " + patientPhn);
        }

        Patient patient = patientOpt.get();

        FollowUp entity = FollowUp.builder()
                .patient(patient)
                .date(dto.getDateOfVisit() != null ? dto.getDateOfVisit() : (dto.getDate() != null ? dto.getDate() : LocalDate.now().toString()))
                .doctorNote(dto.getDoctorNote() != null ? dto.getDoctorNote() : dto.getNotes())
                .sCreatinine(dto.getSCreatinine() != null ? dto.getSCreatinine().toString() : null)
                .eGFR(dto.getEGFR() != null ? dto.getEGFR().toString() : null)
                .build();

        FollowUp saved = repository.save(entity);
        return convertToDTO(saved);
    }

    public List<FollowUpDTO> getByPatientPhn(String patientPhn) {
        return repository.findByPatientPhn(patientPhn)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private FollowUpDTO convertToDTO(FollowUp entity) {
        FollowUpDTO dto = new FollowUpDTO();
        dto.setId(entity.getId());
        dto.setDate(entity.getDate());
        dto.setDateOfVisit(entity.getDate());
        dto.setDoctorNote(entity.getDoctorNote());
        dto.setNotes(entity.getDoctorNote());
        try {
            if (entity.getSCreatinine() != null) {
                dto.setSCreatinine(Double.parseDouble(entity.getSCreatinine()));
            }
            if (entity.getEGFR() != null) {
                dto.setEGFR(Double.parseDouble(entity.getEGFR()));
            }
        } catch (Exception ignored) {}
        return dto;
    }
}