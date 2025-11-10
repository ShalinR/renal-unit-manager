package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.CapdSummaryDto;
import com.peradeniya.renal.services.CapdSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/capd-summary")
@CrossOrigin(origins = "http://localhost:5173") // Match your React app's origin (Vite default port)
public class CapdSummaryController {

    // Inject the Service, not the repository
    private final CapdSummaryService summaryService;

    @Autowired
    public CapdSummaryController(CapdSummaryService summaryService) {
        this.summaryService = summaryService;
    }

    @GetMapping("/{patientId}")
    public CapdSummaryDto getSummary(@PathVariable String patientId) {
        System.out.println("GET request received for patient: " + patientId);
        return summaryService.getSummaryByPatientId(patientId);
    }

    @PostMapping("/{patientId}")
    public CapdSummaryDto saveSummary(@PathVariable String patientId, @RequestBody CapdSummaryDto summaryData) {
        System.out.println("POST request received for patient: " + patientId);

        // Log received PET data to confirm
        if (summaryData.getPetResults() != null && summaryData.getPetResults().getFirst() != null) {
            System.out.println("Saving Test 1 Date: " + summaryData.getPetResults().getFirst().getDate());
        }
        
        // Log received Adequacy data to confirm
        if (summaryData.getAdequacyResults() != null && summaryData.getAdequacyResults().getFirst() != null) {
            System.out.println("Saving Adequacy Test 1 Date: " + summaryData.getAdequacyResults().getFirst().getDate());
            if (summaryData.getAdequacyResults().getFirst().getData() != null) {
                System.out.println("Saving Adequacy Test 1 Total Kt/V: " + summaryData.getAdequacyResults().getFirst().getData().getTotalKtV());
            }
        }

        return summaryService.saveSummary(patientId, summaryData);
    }
}