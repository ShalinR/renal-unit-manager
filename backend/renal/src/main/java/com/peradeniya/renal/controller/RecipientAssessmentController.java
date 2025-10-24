package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.RecipientAssessmentDTO;
import com.peradeniya.renal.dto.RecipientAssessmentResponseDTO;
import com.peradeniya.renal.services.RecipientAssessmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipient-assessment")
public class RecipientAssessmentController {

    private final RecipientAssessmentService service;

    public RecipientAssessmentController(RecipientAssessmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<RecipientAssessmentResponseDTO> create(@RequestBody RecipientAssessmentDTO request) {
        RecipientAssessmentResponseDTO savedAssessment = service.save(request);
        return ResponseEntity.ok(savedAssessment);
    }

    @GetMapping
    public ResponseEntity<List<RecipientAssessmentResponseDTO>> getAll() {
        List<RecipientAssessmentResponseDTO> assessments = service.getAll();
        return ResponseEntity.ok(assessments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipientAssessmentResponseDTO> getById(@PathVariable Long id) {
        RecipientAssessmentResponseDTO assessment = service.getById(id);
        return ResponseEntity.ok(assessment);
    }

    @GetMapping("/patient/{phn}")
    public ResponseEntity<List<RecipientAssessmentResponseDTO>> getByPatientPhn(@PathVariable String phn) {
        List<RecipientAssessmentResponseDTO> assessments = service.getByPatientPhn(phn);
        return ResponseEntity.ok(assessments);
    }

    @GetMapping("/patient/{phn}/latest")
    public ResponseEntity<RecipientAssessmentResponseDTO> getLatestByPatientPhn(@PathVariable String phn) {
        try {
            RecipientAssessmentResponseDTO assessment = service.getLatestByPatientPhn(phn);
            if (assessment == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(assessment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipientAssessmentResponseDTO> updateAssessment(
            @PathVariable Long id,
            @RequestBody RecipientAssessmentDTO request) {
        try {
            // Ensure the ID in the path matches the ID in the request body
            request.setId(id);
            RecipientAssessmentResponseDTO updatedAssessment = service.save(request);
            return ResponseEntity.ok(updatedAssessment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}