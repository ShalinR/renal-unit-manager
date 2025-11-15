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

        // Handle notes - prefer doctorNote, fallback to notes
        String noteText = null;
        if (dto.getDoctorNote() != null && !dto.getDoctorNote().trim().isEmpty()) {
            noteText = dto.getDoctorNote().trim();
        } else if (dto.getNotes() != null && !dto.getNotes().trim().isEmpty()) {
            noteText = dto.getNotes().trim();
        }

        // Validate that notes are provided
        if (noteText == null || noteText.isEmpty()) {
            throw new RuntimeException("Doctor's note cannot be empty");
        }

        FollowUp entity = FollowUp.builder()
                .patient(patient)
                .date(dto.getDateOfVisit() != null ? dto.getDateOfVisit() : (dto.getDate() != null ? dto.getDate() : LocalDate.now().toString()))
                .doctorNote(noteText)
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

    public Optional<FollowUpDTO> getById(Long id) {
        return repository.findById(id).map(this::convertToDTO);
    }

    public FollowUpDTO update(Long id, FollowUpDTO dto) {
        FollowUp entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Follow-up not found with id: " + id));

        // Update fields
        if (dto.getDateOfVisit() != null) {
            entity.setDate(dto.getDateOfVisit());
        } else if (dto.getDate() != null) {
            entity.setDate(dto.getDate());
        }

        if (dto.getDoctorNote() != null) {
            entity.setDoctorNote(dto.getDoctorNote());
        } else if (dto.getNotes() != null) {
            entity.setDoctorNote(dto.getNotes());
        }

        if (dto.getSCreatinine() != null) {
            entity.setSCreatinine(dto.getSCreatinine().toString());
        }

        if (dto.getEGFR() != null) {
            entity.setEGFR(dto.getEGFR().toString());
        }

        FollowUp saved = repository.save(entity);
        return convertToDTO(saved);
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