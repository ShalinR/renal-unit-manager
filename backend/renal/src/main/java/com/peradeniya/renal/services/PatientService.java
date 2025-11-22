package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.*;
import com.peradeniya.renal.mapper.PatientMapper;
import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    // private final PatientRepository patientRepository;
    private final PatientMapper mapper;
    private final AdmissionService admissionService;

    private final PatientRepository repository;
    private final RecipientAssessmentService recipientAssessmentService;
    private final DonorAssessmentService donorAssessmentService;
    private final KTSurgeryService ktSurgeryService;
    private final FollowUpService followUpService;

    // THIS CAUSES AN ISSUE WITH LOMBOK AND @REQUIREDARGSCONSTRUCTOR
    
    // public PatientService(PatientRepository repository,
    //                       RecipientAssessmentService recipientAssessmentService,
    //                       DonorAssessmentService donorAssessmentService,
    //                       KTSurgeryService ktSurgeryService,
    //                       FollowUpService followUpService,
    //                       PatientMapper mapper,
    //                       AdmissionService admissionService) {
    //     this.repository = repository;
    //     this.recipientAssessmentService = recipientAssessmentService;
    //     this.donorAssessmentService = donorAssessmentService;
    //     this.ktSurgeryService = ktSurgeryService;
    //     this.followUpService = followUpService;
    //     this.mapper = mapper;
    //     this.admissionService = admissionService;
    // }

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

    // UPDATED CODE
    public Patient createPatient(PatientCreateRequest request) {
        // Check if patient already exists
        Optional<Patient> existingPatient = findByPhn(request.getPhn());
        if (existingPatient.isPresent()) {
            throw new RuntimeException("Patient with PHN " + request.getPhn() + " already exists");
        }

        // Create patient
        Patient patient = mapper.toPatient(request);
        Patient savedPatient = repository.save(patient);

        // Create admission
        Admission admission = admissionService.createAdmission(savedPatient, request);
        System.out.println("✅ Created admission: " + admission.getId() + " for patient: " + savedPatient.getPhn());
        System.out.println("✅ Admission active status: " + admission.isActive());

        return savedPatient;
    }

    public Optional<Patient> findByPhn(String phn) {
        String cleanPhn = phn.replaceAll("[^0-9]", "");
        System.out.println("🔍 Searching for patient with cleaned PHN: " + cleanPhn);
        return repository.findByPhn(cleanPhn);
    }

    public Patient updatePatientStatus(String phn, String status) {
        String cleanPhn = phn.replaceAll("[^0-9]", "");
        Patient patient = findByPhn(cleanPhn)
                .orElseThrow(() -> new RuntimeException("Patient not found with PHN: " + cleanPhn));
        
        patient.setStatus(status);
        return repository.save(patient);
    }

    public Optional<Admission> getActiveAdmission(Patient patient) {
        System.out.println("🔍 Looking for active admission for patient: " + patient.getPhn());
        Optional<Admission> admissionOpt = admissionService.getActiveAdmission(patient);
        
        if (admissionOpt.isPresent()) {
            System.out.println("✅ Found active admission: " + admissionOpt.get().getId());
        } else {
            System.out.println("❌ No active admission found for patient: " + patient.getPhn());
            // Let's check if there are any admissions at all
            var allAdmissions = admissionService.getAdmissionsForPatient(patient);
            System.out.println("📋 Total admissions for patient: " + allAdmissions.size());
            allAdmissions.forEach(adm -> System.out.println("   - Admission " + adm.getId() + ", active: " + adm.isActive()));
        }
        
        return admissionOpt;
    }
    
   public Patient getPatientByPhn(String phn) {
    String cleanPhn = phn.replaceAll("[^0-9]", "");
    System.out.println("🔍 PATIENT SERVICE: Getting patient by PHN: " + cleanPhn);
    
    Optional<Patient> patientOpt = findByPhn(cleanPhn);
    
    if (patientOpt.isPresent()) {
        Patient patient = patientOpt.get();
        System.out.println("✅ PATIENT SERVICE: Found patient - ID: " + patient.getId() + ", Name: " + patient.getName());
        System.out.println("✅ PATIENT SERVICE: Patient status: " + patient.getStatus());
        System.out.println("✅ PATIENT SERVICE: Total admissions: " + patient.getAdmissions().size());
        
        // Log all admissions
        patient.getAdmissions().forEach(adm -> {
            System.out.println("   📋 Admission ID: " + adm.getId() + ", Active: " + adm.isActive() + ", BHT: " + adm.getBhtNumber());
        });
        
        return patient;
    } else {
        System.out.println("❌ PATIENT SERVICE: No patient found with PHN: " + cleanPhn);
        throw new RuntimeException("Patient not found with PHN: " + cleanPhn);
    }
}
}