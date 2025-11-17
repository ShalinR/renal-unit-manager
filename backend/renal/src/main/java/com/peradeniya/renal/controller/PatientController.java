package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.PatientBasicDTO;
import com.peradeniya.renal.dto.PatientProfileDTO;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.services.PatientService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

import org.springframework.http.ResponseEntity;

import java.util.Optional;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final PatientService service;

    public PatientController(PatientService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        Patient savedPatient = service.save(patient);
        return ResponseEntity.ok(savedPatient);
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = service.getAll();
        return ResponseEntity.ok(patients);
    }

    // For global search - returns basic info only
    @GetMapping("/{phn}")
    public ResponseEntity<PatientBasicDTO> getByPhn(@PathVariable String phn) {
        Optional<PatientBasicDTO> patient = service.getBasicByPhn(phn);
        return patient.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // For complete patient profile
    @GetMapping("/{phn}/profile")
    public ResponseEntity<PatientProfileDTO> getProfileByPhn(@PathVariable String phn) {
        Optional<PatientProfileDTO> profile = service.getPatientProfile(phn);
        return profile.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}