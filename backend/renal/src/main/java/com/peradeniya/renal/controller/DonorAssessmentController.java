package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.DonorAssessmentDTO;
import com.peradeniya.renal.dto.DonorAssessmentResponseDTO;
import com.peradeniya.renal.services.DonorAssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donor-assessment")
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}