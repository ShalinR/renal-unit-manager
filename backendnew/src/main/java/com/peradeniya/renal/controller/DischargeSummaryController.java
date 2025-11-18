package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.DischargeSummaryRequest;
import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.DischargeSummary;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.service.AdmissionService;
import com.peradeniya.renal.service.DischargeSummaryService;
import com.peradeniya.renal.service.PatientService;
import com.peradeniya.renal.service.pdf.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patients/{phn}/admissions/{admId}/discharge-summary")
@RequiredArgsConstructor
public class DischargeSummaryController {

    private final PatientService patientService;
    private final AdmissionService admissionService;
    private final DischargeSummaryService dsService;
    private final PdfService pdfService;

    @PostMapping
    public DischargeSummary create(
            @PathVariable String phn,
            @PathVariable Long admId,
            @RequestBody DischargeSummaryRequest req
    ) {
        Patient p = patientService.findByPhn(phn).orElseThrow();
        return dsService.create(admId, p, req);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> getPdf(
            @PathVariable String phn,
            @PathVariable Long admId
    ) {
        Admission adm = admissionService.getById(admId);

        if (!adm.getPatient().getPhn().equals(phn))
            throw new RuntimeException("Admission not linked to patient");

        DischargeSummary ds = adm.getDischargeSummary();
        if (ds == null)
            throw new RuntimeException("Discharge summary not found");

        byte[] pdf = pdfService.generateDischargeSummaryPdf(ds);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "attachment; filename=discharge-summary.pdf")
                .body(pdf);
    }
}
