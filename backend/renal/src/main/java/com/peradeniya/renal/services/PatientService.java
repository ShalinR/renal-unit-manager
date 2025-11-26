package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.*;
import com.peradeniya.renal.mapper.PatientMapper;
import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Allergy;
import com.peradeniya.renal.model.MedicalProblem;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
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
    
    // Optional HIPAA audit service (won't break if not available)
    @Autowired(required = false)
    private HipaaAuditService hipaaAuditService;

    // Getter for audit service
    public HipaaAuditService getHipaaAuditService() {
        return hipaaAuditService;
    }

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
        Patient saved = repository.save(patient);
        // Audit removed - call createPatientWithAudit from controller instead
        return saved;
    }

    public List<Patient> getAll() {
        List<Patient> patients = repository.findAll();
        // Audit removed - no direct controller call, used by service methods
        return patients;
    }

    public Optional<Patient> getByPhn(String phn) {
        Optional<Patient> patient = repository.findByPhn(phn);
        // Audit removed - call getPatientByPhnWithAudit from controller
        return patient;
    }

    public Optional<PatientBasicDTO> getBasicByPhn(String phn) {
        Optional<Patient> patientOpt = repository.findByPhn(phn);
        // Audit removed - handled by GET /{phn} endpoint
        return patientOpt.map(this::convertToBasicDTO);
    }

    public Optional<PatientProfileDTO> getPatientProfile(String phn) {
        Optional<Patient> patientOpt = repository.findByPhn(phn);
        // Audit removed - handled by GET /{phn}/profile endpoint
        return patientOpt.map(this::convertToProfileDTO);
    }

    public List<PatientBasicDTO> getAllBasic() {
        return repository.findAll().stream()
                .map(this::convertToBasicDTO)
                .collect(Collectors.toList());
    }

    public void deleteById(Long id) {
        // Audit removed - call deleteByIdWithAudit from controller
        Optional<Patient> patientOpt = repository.findById(id);
        if (patientOpt.isPresent()) {
            repository.deleteById(id);
        }
    }

    public Patient updatePatient(Long id, Patient patientDetails) {
        Patient patient = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));

        // Audit removed - call updatePatientStatusWithAudit from controller

        // Update fields
        patient.setName(patientDetails.getName());
        // If a dateOfBirth is provided, compute age server-side to keep DB consistent
        if (patientDetails.getDateOfBirth() != null) {
            try {
                int years = java.time.Period.between(patientDetails.getDateOfBirth(), java.time.LocalDate.now()).getYears();
                patient.setAge(years);
            } catch (Exception e) {
                patient.setAge(patientDetails.getAge());
            }
        } else {
            patient.setAge(patientDetails.getAge());
        }
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
        // Ensure age is set on the entity: calculate from dateOfBirth if missing
        try {
            if ((patient.getAge() == null || patient.getAge() == 0) && request.getDateOfBirth() != null) {
                int years = java.time.Period.between(request.getDateOfBirth(), java.time.LocalDate.now()).getYears();
                patient.setAge(years);
                System.out.println("ℹ️ Computed age on create: " + years + " for PHN: " + patient.getPhn());
            }
        } catch (Exception e) {
            System.out.println("⚠️ Failed to compute age on create: " + e.getMessage());
        }

        Patient savedPatient = repository.save(patient);

        // Audit removed - call createPatientWithAudit from controller instead

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
        
        // Audit removed - call getPatientByPhnWithAudit from controller instead
        
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

// ========== AUDIT-AWARE METHODS (Called from Controller with user info) ==========

    /**
     * Create patient with explicit user audit information
     */
    public Patient createPatientWithAudit(PatientCreateRequest request, String username, String userRole) {
        // Log audit FIRST
        if (hipaaAuditService != null) {
            hipaaAuditService.logPatientAccessWithUser(username, userRole, "CREATE", request.getPhn(), "Created new patient");
        }
        // Then create the patient
        return createPatient(request);
    }

    /**
     * Get patient by PHN with explicit user audit information
     */
    public Patient getPatientByPhnWithAudit(String phn, String username, String userRole) {
        String cleanPhn = phn.replaceAll("[^0-9]", "");
        // Log audit FIRST
        if (hipaaAuditService != null) {
            hipaaAuditService.logPatientAccessWithUser(username, userRole, "VIEW", cleanPhn, "Retrieved patient by PHN");
        }
        // Then get the patient
        return getPatientByPhn(cleanPhn);
    }

    /**
     * Update patient status with explicit user audit information
     */
    public Patient updatePatientStatusWithAudit(String phn, String status, String username, String userRole) {
        String cleanPhn = phn.replaceAll("[^0-9]", "");
        // Log audit FIRST
        if (hipaaAuditService != null) {
            hipaaAuditService.logPatientAccessWithUser(username, userRole, "UPDATE", cleanPhn, "Updated patient status to: " + status);
        }
        // Then update the patient
        return updatePatientStatus(cleanPhn, status);
    }

    /**
     * Delete patient by ID with explicit user audit information
     */
    public void deleteByIdWithAudit(Long id, String username, String userRole) {
        // Get patient PHN first
        Optional<Patient> patientOpt = repository.findById(id);
        String phn = patientOpt.map(Patient::getPhn).orElse("UNKNOWN");
        
        // Log audit FIRST
        if (hipaaAuditService != null) {
            hipaaAuditService.logPatientAccessWithUser(username, userRole, "DELETE", phn, "Deleted patient");
        }
        // Then delete the patient
        deleteById(id);
    }

    public void updateMedicalProblems(String phn, List<String> problems) {
        Patient patient = getPatientByPhn(phn);
        patient.getMedicalHistory().clear();
        for (String problem : problems) {
            if (!problem.trim().isEmpty()) {
                MedicalProblem mp = MedicalProblem.builder()
                        .problem(problem.trim())
                        .patient(patient)
                        .build();
                patient.getMedicalHistory().add(mp);
            }
        }
        repository.save(patient);
    }

    public void updateAllergies(String phn, List<String> allergies) {
        Patient patient = getPatientByPhn(phn);
        patient.getAllergies().clear();
        for (String allergy : allergies) {
            if (!allergy.trim().isEmpty()) {
                Allergy a = Allergy.builder()
                        .allergy(allergy.trim())
                        .patient(patient)
                        .build();
                patient.getAllergies().add(a);
            }
        }
        repository.save(patient);
    }
}