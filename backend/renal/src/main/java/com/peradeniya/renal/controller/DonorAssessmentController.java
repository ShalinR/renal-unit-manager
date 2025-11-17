package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.DonorAssessmentDTO;
import com.peradeniya.renal.dto.DonorAssessmentResponseDTO;
import com.peradeniya.renal.dto.DonorAssignmentDTO;
import com.peradeniya.renal.services.DonorAssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donor-assessment")
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
public class DonorAssessmentController {

    private final DonorAssessmentService service;

    public DonorAssessmentController(DonorAssessmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<DonorAssessmentResponseDTO> create(@RequestBody DonorAssessmentDTO request) {
        DonorAssessmentResponseDTO savedAssessment = service.save(request);
        return ResponseEntity.ok(savedAssessment);
    }

    @GetMapping
    public ResponseEntity<List<DonorAssessmentResponseDTO>> getAll() {
        List<DonorAssessmentResponseDTO> assessments = service.getAll();
        return ResponseEntity.ok(assessments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonorAssessmentResponseDTO> getById(@PathVariable Long id) {
        DonorAssessmentResponseDTO assessment = service.getById(id);
        return ResponseEntity.ok(assessment);
    }

    @GetMapping("/patient/{phn}")
    public ResponseEntity<List<DonorAssessmentResponseDTO>> getByPatientPhn(@PathVariable String phn) {
        List<DonorAssessmentResponseDTO> assessments = service.getByPatientPhn(phn);
        return ResponseEntity.ok(assessments);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // NEW ENDPOINTS FOR ASSIGNMENT FUNCTIONALITY
    @PostMapping("/assign")
    public ResponseEntity<Void> assignDonorToRecipient(@RequestBody DonorAssignmentDTO assignment) {
        service.assignDonorToRecipient(assignment);
        return ResponseEntity.ok().build();
    }
    // In DonorAssessmentController.java - ADD THIS ENDPOINT
    @GetMapping("/available")
    public ResponseEntity<List<DonorAssessmentResponseDTO>> getAvailableDonors() {
        List<DonorAssessmentResponseDTO> availableDonors = service.getAvailableDonors();
        return ResponseEntity.ok(availableDonors);
    }

    @PostMapping("/{id}/unassign")
    public ResponseEntity<Void> unassignDonor(@PathVariable Long id) {
        service.unassignDonor(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateDonorStatus(@PathVariable Long id, @RequestBody Map<String, String> statusRequest) {
        service.updateDonorStatus(id, statusRequest.get("status"));
        return ResponseEntity.ok().build();
    }
}