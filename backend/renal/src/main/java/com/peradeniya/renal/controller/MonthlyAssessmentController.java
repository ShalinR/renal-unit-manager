package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.MonthlyAssessmentDto;
import com.peradeniya.renal.services.MonthlyAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monthly-assessment")
@CrossOrigin(origins = "http://localhost:5173")
public class MonthlyAssessmentController {

    private final MonthlyAssessmentService assessmentService;

    @Autowired
    public MonthlyAssessmentController(MonthlyAssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<List<MonthlyAssessmentDto>> getAllAssessments(@PathVariable String patientId) {
        try {
            List<MonthlyAssessmentDto> assessments = assessmentService.getAllAssessmentsByPatientId(patientId);
            return ResponseEntity.ok(assessments);
        } catch (Exception e) {
            System.err.println("Error fetching assessments: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{patientId}")
    public ResponseEntity<MonthlyAssessmentDto> saveAssessment(
            @PathVariable String patientId,
            @RequestBody MonthlyAssessmentDto dto) {
        try {
            MonthlyAssessmentDto saved = assessmentService.saveAssessment(patientId, dto);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error saving assessment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{patientId}/{id}")
    public ResponseEntity<MonthlyAssessmentDto> updateAssessment(
            @PathVariable String patientId,
            @PathVariable Long id,
            @RequestBody MonthlyAssessmentDto dto) {
        try {
            MonthlyAssessmentDto updated = assessmentService.updateAssessment(patientId, id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Error updating assessment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{patientId}/{id}")
    public ResponseEntity<Void> deleteAssessment(
            @PathVariable String patientId,
            @PathVariable Long id) {
        try {
            assessmentService.deleteAssessment(patientId, id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error deleting assessment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

