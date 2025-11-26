package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.PDInvestigationSummaryDto;
import com.peradeniya.renal.services.PDInvestigationSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pd-investigation")
@CrossOrigin(origins = "http://localhost:5173")
public class PDInvestigationSummaryController {

    private final PDInvestigationSummaryService service;

    @Autowired
    public PDInvestigationSummaryController(PDInvestigationSummaryService service) {
        this.service = service;
    }

    @PostMapping("/{patientId}")
    public ResponseEntity<PDInvestigationSummaryDto> createSummary(
            @PathVariable String patientId,
            @RequestBody PDInvestigationSummaryDto dto) {
        PDInvestigationSummaryDto savedSummary = service.createSummary(patientId, dto);
        return ResponseEntity.ok(savedSummary);
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<List<PDInvestigationSummaryDto>> getSummariesByPatientId(
            @PathVariable String patientId) {
        List<PDInvestigationSummaryDto> summaries = service.getSummariesByPatientId(patientId);
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/record/{id}")
    public ResponseEntity<PDInvestigationSummaryDto> getSummaryById(@PathVariable Long id) {
        PDInvestigationSummaryDto summary = service.getSummaryById(id);
        if (summary != null) {
            return ResponseEntity.ok(summary);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/record/{id}")
    public ResponseEntity<PDInvestigationSummaryDto> updateSummary(
            @PathVariable Long id,
            @RequestBody PDInvestigationSummaryDto dto) {
        PDInvestigationSummaryDto updatedSummary = service.updateSummary(id, dto);
        return ResponseEntity.ok(updatedSummary);
    }

    @DeleteMapping("/record/{id}")
    public ResponseEntity<Void> deleteSummary(@PathVariable Long id) {
        service.deleteSummary(id);
        return ResponseEntity.ok().build();
    }
}

