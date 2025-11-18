package com.peradeniya.renal.controller;

import com.peradeniya.renal.model.DischargeSummary;
import com.peradeniya.renal.services.DischargeSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ward/discharge-summary")
@RequiredArgsConstructor
@CrossOrigin
public class DischargeSummaryController {

    private final DischargeSummaryService dischargeSummaryService;

    @PostMapping("/{admissionId}")
    public DischargeSummary createSummary(
            @PathVariable Long admissionId,
            @RequestBody DischargeSummary summary
    ) {
        return dischargeSummaryService.createSummary(admissionId, summary);
    }

    @GetMapping("/{admissionId}")
    public DischargeSummary getSummary(@PathVariable Long admissionId) {
        return dischargeSummaryService.getSummary(admissionId);
    }
}
