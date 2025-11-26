package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.PatientProfileDTO;
import com.peradeniya.renal.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Controller for getting complete patient profiles including all related data
 * (patient info, recipient assessment, donor assessment, KT surgery, follow-ups)
 */
@RestController
@RequestMapping("/api/patient-profile")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientProfileController {

    @Autowired
    private PatientService patientService;

    /**
     * Get complete patient profile by PHN
     * Includes: patient info, recipient assessment, donor assessment, KT surgery, follow-ups
     */
    @GetMapping("/{phn}")
    public ResponseEntity<PatientProfileDTO> getPatientProfile(@PathVariable String phn) {
        try {
            System.out.println("🔵 [PatientProfileController] Fetching complete profile for PHN: " + phn);
            Optional<PatientProfileDTO> profile = patientService.getPatientProfile(phn);

            if (profile.isPresent()) {
                System.out.println("✅ [PatientProfileController] Successfully retrieved profile for PHN: " + phn);
                return ResponseEntity.ok(profile.get());
            } else {
                System.out.println("⚠️ [PatientProfileController] Patient not found for PHN: " + phn);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("❌ [PatientProfileController] Error fetching patient profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
