package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.InfectionTrackingDto;
import com.peradeniya.renal.services.InfectionTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/infection-tracking")
@CrossOrigin(origins = "http://localhost:5173")
public class InfectionTrackingController {

    private final InfectionTrackingService infectionTrackingService;

    @Autowired
    public InfectionTrackingController(InfectionTrackingService infectionTrackingService) {
        this.infectionTrackingService = infectionTrackingService;
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<List<InfectionTrackingDto>> getAllInfections(@PathVariable String patientId) {
        try {
            List<InfectionTrackingDto> infections = infectionTrackingService.getAllInfections(patientId);
            return ResponseEntity.ok(infections);
        } catch (Exception e) {
            System.err.println("Error fetching infections: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{patientId}/{infectionType}")
    public ResponseEntity<List<InfectionTrackingDto>> getInfectionsByType(
            @PathVariable String patientId,
            @PathVariable String infectionType) {
        try {
            List<InfectionTrackingDto> infections = infectionTrackingService.getInfectionsByType(patientId, infectionType);
            return ResponseEntity.ok(infections);
        } catch (Exception e) {
            System.err.println("Error fetching infections by type: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{patientId}")
    public ResponseEntity<Map<String, List<InfectionTrackingDto>>> saveAllInfections(
            @PathVariable String patientId,
            @RequestBody Map<String, List<InfectionTrackingDto>> infectionsData) {
        try {
            // Delete existing records for this patient
            infectionTrackingService.deleteAllByPatientId(patientId);

            // Save all new records
            List<InfectionTrackingDto> peritonitis = infectionsData.getOrDefault("peritonitis", List.of());
            List<InfectionTrackingDto> exitSite = infectionsData.getOrDefault("exitSite", List.of());
            List<InfectionTrackingDto> tunnel = infectionsData.getOrDefault("tunnel", List.of());

            List<InfectionTrackingDto> savedPeritonitis = infectionTrackingService.saveInfections(patientId, peritonitis);
            List<InfectionTrackingDto> savedExitSite = infectionTrackingService.saveInfections(patientId, exitSite);
            List<InfectionTrackingDto> savedTunnel = infectionTrackingService.saveInfections(patientId, tunnel);

            Map<String, List<InfectionTrackingDto>> result = Map.of(
                "peritonitis", savedPeritonitis,
                "exitSite", savedExitSite,
                "tunnel", savedTunnel
            );

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error saving infections: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{patientId}/peritonitis")
    public ResponseEntity<List<InfectionTrackingDto>> savePeritonitisInfections(
            @PathVariable String patientId,
            @RequestBody List<InfectionTrackingDto> peritonitisData) {
        try {
            List<InfectionTrackingDto> saved = infectionTrackingService.savePeritonitisInfections(patientId, peritonitisData);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error saving peritonitis infections: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{patientId}/exit-site")
    public ResponseEntity<List<InfectionTrackingDto>> saveExitSiteInfections(
            @PathVariable String patientId,
            @RequestBody List<InfectionTrackingDto> exitSiteData) {
        try {
            List<InfectionTrackingDto> saved = infectionTrackingService.saveExitSiteInfections(patientId, exitSiteData);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error saving exit site infections: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{patientId}/tunnel")
    public ResponseEntity<List<InfectionTrackingDto>> saveTunnelInfections(
            @PathVariable String patientId,
            @RequestBody List<InfectionTrackingDto> tunnelData) {
        try {
            List<InfectionTrackingDto> saved = infectionTrackingService.saveTunnelInfections(patientId, tunnelData);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error saving tunnel infections: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

