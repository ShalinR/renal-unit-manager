package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.FeedbackDTO;
import com.peradeniya.renal.services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
// CORS is handled globally by SecurityConfig.corsConfigurationSource()
// Removed @CrossOrigin(origins = "*") as it conflicts with allowCredentials=true
public class FeedbackController {

    @Autowired
    private FeedbackService service;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody FeedbackDTO dto) {
        try {
            FeedbackDTO saved = service.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Bad request"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    @GetMapping
    public ResponseEntity<List<FeedbackDTO>> getAll() {
        try {
            List<FeedbackDTO> feedbacks = service.getAll();
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<FeedbackDTO>> getByStatus(@PathVariable String status) {
        try {
            List<FeedbackDTO> feedbacks = service.getByStatus(status);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            if (status == null || status.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
            }
            FeedbackDTO updated = service.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

