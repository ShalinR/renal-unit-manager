package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.HemodialysisInvestigationDto;
import com.peradeniya.renal.service.HemodialysisInvestigationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hemodialysis-investigation")
@CrossOrigin(origins = "http://localhost:5173")
public class HemodialysisInvestigationController {

    @Autowired
    private HemodialysisInvestigationService hemodialysisInvestigationService;

    // Monthly Review endpoints (must come before generic patient endpoints to avoid route conflicts)
    @GetMapping("/monthly-review/{monthlyReviewId}")
    public ResponseEntity<List<HemodialysisInvestigationDto>> getInvestigationsByMonthlyReview(@PathVariable Long monthlyReviewId) {
        List<HemodialysisInvestigationDto> investigations = hemodialysisInvestigationService.getInvestigationsByMonthlyReviewId(monthlyReviewId);
        return ResponseEntity.ok(investigations);
    }

    @GetMapping("/monthly-review/{monthlyReviewId}/{id}")
    public ResponseEntity<HemodialysisInvestigationDto> getInvestigationByMonthlyReview(@PathVariable Long monthlyReviewId, @PathVariable Long id) {
        HemodialysisInvestigationDto investigation = hemodialysisInvestigationService.getInvestigationByIdAndMonthlyReviewId(id, monthlyReviewId);
        if (investigation != null) {
            return ResponseEntity.ok(investigation);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/monthly-review/{monthlyReviewId}")
    public ResponseEntity<HemodialysisInvestigationDto> createInvestigationForMonthlyReview(@PathVariable Long monthlyReviewId, @RequestBody HemodialysisInvestigationDto dto) {
        dto.setMonthlyReviewId(monthlyReviewId);
        // Ensure patientId is set; if not provided in DTO, we'll need to get it from the monthly review
        // For now, patientId should come from the frontend
        if (dto.getPatientId() == null || dto.getPatientId().isEmpty()) {
            return ResponseEntity.badRequest().build(); // PatientId is required
        }
        HemodialysisInvestigationDto createdInvestigation = hemodialysisInvestigationService.createInvestigation(dto.getPatientId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdInvestigation);
    }

    @PutMapping("/monthly-review/{monthlyReviewId}/{id}")
    public ResponseEntity<HemodialysisInvestigationDto> updateInvestigationByMonthlyReview(@PathVariable Long monthlyReviewId, @PathVariable Long id, @RequestBody HemodialysisInvestigationDto dto) {
        dto.setMonthlyReviewId(monthlyReviewId);
        HemodialysisInvestigationDto updatedInvestigation = hemodialysisInvestigationService.updateInvestigation(id, dto.getPatientId(), dto);
        if (updatedInvestigation != null) {
            return ResponseEntity.ok(updatedInvestigation);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/monthly-review/{monthlyReviewId}/{id}")
    public ResponseEntity<Void> deleteInvestigationByMonthlyReview(@PathVariable Long monthlyReviewId, @PathVariable Long id) {
        // For now, we'll use the existing delete with patientId check; in production, verify monthlyReviewId too
        // First fetch the investigation to get patientId
        HemodialysisInvestigationDto investigation = hemodialysisInvestigationService.getInvestigationByIdAndMonthlyReviewId(id, monthlyReviewId);
        if (investigation != null) {
            boolean deleted = hemodialysisInvestigationService.deleteInvestigation(id, investigation.getPatientId());
            if (deleted) {
                return ResponseEntity.noContent().build();
            }
        }
        return ResponseEntity.notFound().build();
    }

    // Generic patient endpoints
    @GetMapping("/{patientId}")
    public ResponseEntity<List<HemodialysisInvestigationDto>> getInvestigations(@PathVariable String patientId) {
        List<HemodialysisInvestigationDto> investigations = hemodialysisInvestigationService.getInvestigationsByPatientId(patientId);
        return ResponseEntity.ok(investigations);
    }

    @GetMapping("/{patientId}/{id}")
    public ResponseEntity<HemodialysisInvestigationDto> getInvestigation(@PathVariable String patientId, @PathVariable Long id) {
        HemodialysisInvestigationDto investigation = hemodialysisInvestigationService.getInvestigationById(id, patientId);
        if (investigation != null) {
            return ResponseEntity.ok(investigation);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{patientId}")
    public ResponseEntity<HemodialysisInvestigationDto> createInvestigation(@PathVariable String patientId, @RequestBody HemodialysisInvestigationDto dto) {
        HemodialysisInvestigationDto createdInvestigation = hemodialysisInvestigationService.createInvestigation(patientId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdInvestigation);
    }

    @PutMapping("/{patientId}/{id}")
    public ResponseEntity<HemodialysisInvestigationDto> updateInvestigation(@PathVariable String patientId, @PathVariable Long id, @RequestBody HemodialysisInvestigationDto dto) {
        HemodialysisInvestigationDto updatedInvestigation = hemodialysisInvestigationService.updateInvestigation(id, patientId, dto);
        if (updatedInvestigation != null) {
            return ResponseEntity.ok(updatedInvestigation);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{patientId}/{id}")
    public ResponseEntity<Void> deleteInvestigation(@PathVariable String patientId, @PathVariable Long id) {
        boolean deleted = hemodialysisInvestigationService.deleteInvestigation(id, patientId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
