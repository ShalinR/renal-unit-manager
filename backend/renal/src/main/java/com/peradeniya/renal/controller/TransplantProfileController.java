package com.peradeniya.renal.controller;


import com.peradeniya.renal.dto.TransplantProfileDTO;
import com.peradeniya.renal.services.TransplantProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transplant/profile")
public class TransplantProfileController {

    private final TransplantProfileService transplantProfileService;

    public TransplantProfileController(TransplantProfileService transplantProfileService) {
        this.transplantProfileService = transplantProfileService;
    }

    @GetMapping("/{phn}")
    public ResponseEntity<TransplantProfileDTO> getTransplantProfile(@PathVariable String phn) {
        try {
            TransplantProfileDTO profile = transplantProfileService.getTransplantProfile(phn);
            if (profile == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}