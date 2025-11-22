package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.PatientBasicDTO;
import com.peradeniya.renal.dto.PatientCreateRequest;
import com.peradeniya.renal.dto.PatientProfileDTO;
import com.peradeniya.renal.dto.PatientResponse;
import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.services.PatientService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;

import java.util.Optional;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService service;

    // OLD CODE
    // public PatientController(PatientService service) {
    //     this.service = service;
    // }

    // @PostMapping
    // public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
    //     Patient savedPatient = service.save(patient);
    //     return ResponseEntity.ok(savedPatient);
    // }

    // @GetMapping
    // public ResponseEntity<List<Patient>> getAllPatients() {
    //     List<Patient> patients = service.getAll();
    //     return ResponseEntity.ok(patients);
    // }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody PatientCreateRequest request) {
        Patient patient = service.createPatient(request);
        return ResponseEntity.ok(patient);
    }

    @GetMapping
    public ResponseEntity<PatientResponse> getPatientByPhn(@RequestParam("phn") String phn) {
        String cleanPhn = phn.replaceAll("[^0-9]", "");
        Patient patient = service.getPatientByPhn(cleanPhn);

        Admission active = service.getActiveAdmission(patient).orElse(null);

        PatientResponse response = PatientResponse.from(patient, active);

        return ResponseEntity.ok(response);
    }


    @PutMapping("/{phn}/status")
    public ResponseEntity<Patient> updatePatientStatus(
            @PathVariable("phn") String phn,
            @RequestBody StatusUpdateRequest request) {

        String cleanPhn = phn.replaceAll("[^0-9]", "");
        Patient patient = service.updatePatientStatus(cleanPhn, request.getStatus());
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/debug/{phn}")
    public ResponseEntity<Map<String, Object>> debugPatient(@PathVariable("phn") String phn) {

        String cleanPhn = phn.replaceAll("[^0-9]", "");
        try {
            Patient patient = service.getPatientByPhn(cleanPhn);
            Optional<Admission> admissionOpt = service.getActiveAdmission(patient);
            Admission admission = admissionOpt.orElse(null);

            PatientResponse response = PatientResponse.from(patient, admission);

            Map<String, Object> debug = new HashMap<>();
            debug.put("patient", patient);
            debug.put("activeAdmission", response.getActiveAdmission());
            debug.put("activeAdmissionId",
                    response.getActiveAdmission() != null ? response.getActiveAdmission().getId() : null);

            return ResponseEntity.ok(debug);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
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

    public static class StatusUpdateRequest {
        private String status;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}