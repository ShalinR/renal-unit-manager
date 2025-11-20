package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.PatientCreateRequest;
import com.peradeniya.renal.dto.PatientResponse;
import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.service.PatientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    public PatientResponse getByPhn(@RequestParam("phn") String phn) {
        log.info("🔍 Searching for patient with PHN: '{}'", phn);
        
        // Clean the PHN - remove any non-numeric characters for search
        String cleanPhn = phn.replaceAll("[^0-9]", "");
        log.info("🔍 Cleaned PHN: '{}'", cleanPhn);
        
        Patient p = patientService.findByPhn(cleanPhn)
                .orElseThrow(() -> {
                    log.error("❌ Patient not found for PHN: '{}' (cleaned: '{}')", phn, cleanPhn);
                    return new RuntimeException("Patient not found");
                });

        Admission active = p.getAdmissions().stream()
                .filter(Admission::isActive)
                .findFirst()
                .orElse(null);

        log.info("✅ Patient found: {} (ID: {})", p.getName(), p.getId());
        return PatientResponse.from(p, active);
    }

    @PostMapping
    public Patient create(@RequestBody PatientCreateRequest r) {
        log.info("➕ Creating patient with PHN: '{}'", r.getPhn());
        // Clean PHN before saving
        String cleanPhn = r.getPhn().replaceAll("[^0-9]", "");
        r.setPhn(cleanPhn);
        
        Patient patient = patientService.createPatient(r);
        log.info("✅ Patient created successfully: {} (ID: {})", patient.getName(), patient.getId());
        return patient;
    }
}