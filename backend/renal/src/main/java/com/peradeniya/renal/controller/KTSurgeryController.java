package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.KTSurgeryDTO;
import com.peradeniya.renal.services.KTSurgeryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transplant")
public class KTSurgeryController {

    @Autowired
    private KTSurgeryService ktSurgeryService;

    /**
     * Create a new KT Surgery record for a patient
     */
    @PostMapping("/kt-surgery/{patientPhn}")
    public ResponseEntity<KTSurgeryDTO> createKTSurgery(
            @PathVariable String patientPhn,
            @Valid @RequestBody KTSurgeryDTO ktSurgeryDTO) {

        try {
            System.out.println("🔵 [KTSurgeryController] Creating KT Surgery for patient: " + patientPhn);
            System.out.println("📋 [KTSurgeryController] Received DTO: " + ktSurgeryDTO);
            
            ktSurgeryDTO.setPatientPhn(patientPhn);
            KTSurgeryDTO saved = ktSurgeryService.createKTSurgery(ktSurgeryDTO);
            
            System.out.println("✅ [KTSurgeryController] Successfully saved KT Surgery: " + saved.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            System.out.println("❌ [KTSurgeryController] Error creating KT Surgery: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get KT Surgery record by patient PHN
     */
    @GetMapping("/kt-surgery/{patientPhn}")
    public ResponseEntity<KTSurgeryDTO> getKTSurgeryByPatientPhn(@PathVariable String patientPhn) {
        try {
            System.out.println("🔵 [KTSurgeryController] Fetching KT Surgery for patient: " + patientPhn);
            Optional<KTSurgeryDTO> ktSurgery = ktSurgeryService.getKTSurgeryByPatientPhn(patientPhn);
            if (ktSurgery.isPresent()) {
                System.out.println("✅ [KTSurgeryController] Found KT Surgery: " + ktSurgery.get().getId());
                return ResponseEntity.ok(ktSurgery.get());
            } else {
                System.out.println("⚠️ [KTSurgeryController] No KT Surgery found for patient: " + patientPhn);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("❌ [KTSurgeryController] Error fetching KT Surgery: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all KT Surgeries for a patient
     */
    @GetMapping("/kt-surgery/all/{patientPhn}")
    public ResponseEntity<List<KTSurgeryDTO>> getAllKTSurgeriesByPatientPhn(@PathVariable String patientPhn) {
        try {
            List<KTSurgeryDTO> ktSurgeries = ktSurgeryService.getAllKTSurgeriesByPatientPhn(patientPhn);
            return ResponseEntity.ok(ktSurgeries);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update KT Surgery record
     */
    @PutMapping("/kt-surgery/{patientPhn}")
    public ResponseEntity<KTSurgeryDTO> updateKTSurgery(
            @PathVariable String patientPhn,
            @Valid @RequestBody KTSurgeryDTO ktSurgeryDTO) {

        try {
            KTSurgeryDTO updated = ktSurgeryService.updateKTSurgery(patientPhn, ktSurgeryDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if KT Surgery exists for patient
     */
    @GetMapping("/kt-surgery/{patientPhn}/exists")
    public ResponseEntity<Boolean> checkKTSurgeryExists(@PathVariable String patientPhn) {
        try {
            boolean exists = ktSurgeryService.existsByPatientPhn(patientPhn);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get latest KT Surgery for patient
     */
    @GetMapping("/kt-surgery/{patientPhn}/latest")
    public ResponseEntity<KTSurgeryDTO> getLatestKTSurgery(@PathVariable String patientPhn) {
        try {
            // Get all surgeries and return the first one (most recent)
            List<KTSurgeryDTO> surgeries = ktSurgeryService.getAllKTSurgeriesByPatientPhn(patientPhn);
            if (surgeries.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(surgeries.get(0)); // First one is latest due to ordering
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}