package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.HemodialysisMonthlyReviewDto;
import com.peradeniya.renal.services.HemodialysisMonthlyReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hemodialysis-monthly-review")
@CrossOrigin(origins = "http://localhost:5173")
public class HemodialysisMonthlyReviewController {

    private final HemodialysisMonthlyReviewService service;

    @Autowired
    public HemodialysisMonthlyReviewController(HemodialysisMonthlyReviewService service) {
        this.service = service;
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<List<HemodialysisMonthlyReviewDto>> getReviewsByPatientId(@PathVariable String patientId) {
        try {
            List<HemodialysisMonthlyReviewDto> reviews = service.getReviewsByPatientId(patientId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            System.err.println("Error fetching reviews: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{patientId}/{id}")
    public ResponseEntity<HemodialysisMonthlyReviewDto> getReviewById(
            @PathVariable String patientId,
            @PathVariable Long id) {
        try {
            HemodialysisMonthlyReviewDto review = service.getReviewById(patientId, id);
            if (review != null) {
                return ResponseEntity.ok(review);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error fetching review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{patientId}")
    public ResponseEntity<HemodialysisMonthlyReviewDto> createReview(
            @PathVariable String patientId,
            @RequestBody HemodialysisMonthlyReviewDto dto) {
        try {
            HemodialysisMonthlyReviewDto created = service.createReview(patientId, dto);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            System.err.println("Error creating review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{patientId}/{id}")
    public ResponseEntity<HemodialysisMonthlyReviewDto> updateReview(
            @PathVariable String patientId,
            @PathVariable Long id,
            @RequestBody HemodialysisMonthlyReviewDto dto) {
        try {
            HemodialysisMonthlyReviewDto updated = service.updateReview(patientId, id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Error updating review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{patientId}/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable String patientId,
            @PathVariable Long id) {
        try {
            service.deleteReview(patientId, id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error deleting review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
