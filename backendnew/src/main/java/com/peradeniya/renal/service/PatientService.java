package com.peradeniya.renal.service;

import com.peradeniya.renal.dto.PatientCreateRequest;
import com.peradeniya.renal.mapper.PatientMapper;
import com.peradeniya.renal.model.*;
import com.peradeniya.renal.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepo;
    private final AdmissionRepository admissionRepo;
    private final MedicalProblemRepository medRepo;
    private final AllergyRepository allergyRepo;
    private final PatientMapper mapper;

    @Transactional
    public Patient createPatient(PatientCreateRequest r) {
        // Clean PHN for checking duplicates
        String cleanPhn = r.getPhn().replaceAll("[^0-9]", "");
        log.info("🔄 Creating patient with cleaned PHN: '{}'", cleanPhn);
        
        // Check if patient already exists with this PHN
        Optional<Patient> existingPatient = patientRepo.findByPhn(cleanPhn);
        if (existingPatient.isPresent()) {
            log.error("❌ Patient already exists with PHN: '{}'", cleanPhn);
            throw new RuntimeException("Patient with PHN " + cleanPhn + " already exists");
        }

        // Map to patient
        Patient p = mapper.toPatient(r);
        p.setStatus("Admitted");
        patientRepo.save(p);
        log.info("✅ Patient saved: {} (ID: {})", p.getName(), p.getId());

        // Create admission
        Admission admission = mapper.toAdmission(r);
        admission.setPatient(p);
        admission.setNumber(1);
        admission.setActive(true);
        admission.setBhtNumber(generateBhtNumber(cleanPhn));
        admissionRepo.save(admission);
        log.info("✅ Admission created: {}", admission.getBhtNumber());

        // Medical history
        if (r.getMedicalProblems() != null) {
            for (String pr : r.getMedicalProblems()) {
                if (pr != null && !pr.isBlank()) {
                    MedicalProblem problem = MedicalProblem.builder()
                            .patient(p)
                            .problem(pr)
                            .build();
                    medRepo.save(problem);
                }
            }
            log.info("✅ Medical problems saved: {}", r.getMedicalProblems().length);
        }

        // Allergies
        if (r.getAllergyProblems() != null) {
            for (String pr : r.getAllergyProblems()) {
                if (pr != null && !pr.isBlank()) {
                    Allergy allergy = Allergy.builder()
                            .patient(p)
                            .allergy(pr)
                            .build();
                    allergyRepo.save(allergy);
                }
            }
            log.info("✅ Allergies saved: {}", r.getAllergyProblems().length);
        }

        return p;
    }

    private String generateBhtNumber(String phn) {
        return "BHT-" + phn + "-" + System.currentTimeMillis();
    }

    public Optional<Patient> findByPhn(String phn) {
        log.info("🔍 Repository search for PHN: '{}'", phn);
        // Clean PHN for search
        String cleanPhn = phn.replaceAll("[^0-9]", "");
        Optional<Patient> patient = patientRepo.findByPhn(cleanPhn);
        
        if (patient.isPresent()) {
            log.info("✅ Repository found patient: {}", patient.get().getName());
        } else {
            log.warn("❌ Repository: No patient found for PHN: '{}'", cleanPhn);
        }
        
        return patient;
    }
}