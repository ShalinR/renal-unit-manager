package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.*;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository repository;
    private final RecipientAssessmentService recipientAssessmentService;
    private final DonorAssessmentService donorAssessmentService;
    private final KTSurgeryService ktSurgeryService;
    private final FollowUpService followUpService;

    public PatientService(PatientRepository repository,
                          RecipientAssessmentService recipientAssessmentService,
                          DonorAssessmentService donorAssessmentService,
                          KTSurgeryService ktSurgeryService,
                          FollowUpService followUpService) {
        this.repository = repository;
        this.recipientAssessmentService = recipientAssessmentService;
        this.donorAssessmentService = donorAssessmentService;
        this.ktSurgeryService = ktSurgeryService;
        this.followUpService = followUpService;
    }

    public Patient save(Patient patient) {
        return repository.save(patient);
    }

    public List<Patient> getAll() {
        return repository.findAll();
    }

    public Optional<Patient> getByPhn(String phn) {
        return repository.findByPhn(phn);
    }

    public Optional<PatientBasicDTO> getBasicByPhn(String phn) {
        Optional<Patient> patientOpt = repository.findByPhn(phn);
        return patientOpt.map(this::convertToBasicDTO);
    }

    public Optional<PatientProfileDTO> getPatientProfile(String phn) {
        Optional<Patient> patientOpt = repository.findByPhn(phn);
        return patientOpt.map(this::convertToProfileDTO);
    }

    public List<PatientBasicDTO> getAllBasic() {
        return repository.findAll().stream()
                .map(this::convertToBasicDTO)
                .collect(Collectors.toList());
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public Patient updatePatient(Long id, Patient patientDetails) {
        Patient patient = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));

        // Update fields
        patient.setName(patientDetails.getName());
        patient.setAge(patientDetails.getAge());
        patient.setGender(patientDetails.getGender());
        patient.setDateOfBirth(patientDetails.getDateOfBirth());
        patient.setOccupation(patientDetails.getOccupation());
        patient.setAddress(patientDetails.getAddress());
        patient.setNicNo(patientDetails.getNicNo());
        patient.setContactDetails(patientDetails.getContactDetails());
        patient.setEmailAddress(patientDetails.getEmailAddress());

        return repository.save(patient);
    }

    public boolean existsByPhn(String phn) {
        return repository.findByPhn(phn).isPresent();
    }

    // Search methods
    public List<PatientBasicDTO> searchByName(String name) {
        return repository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToBasicDTO)
                .collect(Collectors.toList());
    }

    public List<PatientBasicDTO> searchByNic(String nic) {
        return repository.findByNicNoContaining(nic).stream()
                .map(this::convertToBasicDTO)
                .collect(Collectors.toList());
    }

    public List<PatientBasicDTO> searchPatients(String searchTerm) {
        return repository.searchPatients(searchTerm).stream()
                .map(this::convertToBasicDTO)
                .collect(Collectors.toList());
    }

    private PatientBasicDTO convertToBasicDTO(Patient patient) {
        PatientBasicDTO dto = new PatientBasicDTO();
        dto.setId(patient.getId());
        dto.setPhn(patient.getPhn());
        dto.setName(patient.getName());
        dto.setAge(patient.getAge());
        dto.setGender(patient.getGender());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setOccupation(patient.getOccupation());
        dto.setAddress(patient.getAddress());
        dto.setNicNo(patient.getNicNo());
        dto.setContactDetails(patient.getContactDetails());
        dto.setEmailAddress(patient.getEmailAddress());
        return dto;
    }

    private PatientProfileDTO convertToProfileDTO(Patient patient) {
        PatientProfileDTO dto = new PatientProfileDTO();
        dto.setPatientId(patient.getId());
        dto.setPhn(patient.getPhn());
        dto.setName(patient.getName());
        dto.setAge(patient.getAge());
        dto.setGender(patient.getGender());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setOccupation(patient.getOccupation());
        dto.setAddress(patient.getAddress());
        dto.setNicNo(patient.getNicNo());
        dto.setContactDetails(patient.getContactDetails());
        dto.setEmailAddress(patient.getEmailAddress());

        // Fetch and set recipient assessments - get the latest one
        List<RecipientAssessmentResponseDTO> recipientAssessments =
                recipientAssessmentService.getByPatientPhn(patient.getPhn());
        if (!recipientAssessments.isEmpty()) {
            dto.setRecipientAssessment(recipientAssessments.get(0)); // Get the latest one
        }

        // Fetch and set donor assessments - get the latest one
        List<DonorAssessmentResponseDTO> donorAssessments =
                donorAssessmentService.getByPatientPhn(patient.getPhn());
        if (!donorAssessments.isEmpty()) {
            dto.setDonorAssessment(donorAssessments.get(0)); // Get the latest one
        }

        // Fetch and set KT Surgery - get the latest one
        try {
            java.util.Optional<KTSurgeryDTO> ktSurgery = ktSurgeryService.getKTSurgeryByPatientPhn(patient.getPhn());
            if (ktSurgery.isPresent()) {
                dto.setKtSurgery(ktSurgery.get());
            }
        } catch (Exception e) {
            System.out.println("⚠️ Could not fetch KT Surgery for patient: " + patient.getPhn());
        }

        // Fetch and set follow-ups
        try {
            List<FollowUpDTO> followUps = followUpService.getByPatientPhn(patient.getPhn());
            dto.setFollowUps(followUps);
        } catch (Exception e) {
            System.out.println("⚠️ Could not fetch follow-ups for patient: " + patient.getPhn());
            dto.setFollowUps(java.util.List.of());
        }

        return dto;
    }
}