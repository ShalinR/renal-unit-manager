package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.RecipientAssessmentDTO;
import com.peradeniya.renal.dto.RecipientAssessmentResponseDTO;
import com.peradeniya.renal.services.RecipientAssessmentService;
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}