package com.peradeniya.renal.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.services.AdmissionService;
import com.peradeniya.renal.services.PatientService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/patients/{phn}/admissions")
@RequiredArgsConstructor
public class AdmissionController {

    private final PatientService patientService;
    private final AdmissionService admissionService;

    @GetMapping
    public ResponseEntity<List<Admission>> getAdmissions(@PathVariable("phn") String phn) {
        String cleanPhn = phn.replaceAll("[^0-9]", "");
        
        Patient patient = patientService.findByPhn(cleanPhn)
                .orElseThrow(() -> new RuntimeException("Patient not found with PHN: " + cleanPhn));

        // FIXED: Use correct method name
        List<Admission> admissions = admissionService.getAdmissionsForPatient(patient);
        return ResponseEntity.ok(admissions);
    }
}