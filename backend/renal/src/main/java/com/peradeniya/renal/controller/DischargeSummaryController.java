package com.peradeniya.renal.controller;

import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.services.PdfService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.peradeniya.renal.dto.DischargeSummaryRequest;
import com.peradeniya.renal.model.DischargeSummary;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.services.AdmissionService;
import com.peradeniya.renal.services.DischargeSummaryService;
import com.peradeniya.renal.services.PatientService;

import lombok.RequiredArgsConstructor;

import java.util.Map;

@RestController
@RequestMapping("/api/patients/{phn}/admissions/{admId}/discharge-summary")
@RequiredArgsConstructor
public class DischargeSummaryController {

    private final PatientService patientService;
    private final AdmissionService admissionService;
    private final DischargeSummaryService dsService;
    private final PdfService pdfService;
    // private final PdfService pdfService;

    @PostMapping
    public Map<String, Object> create(
            @PathVariable("phn") String phn,
            @PathVariable("admId") Long admId,
            @RequestBody DischargeSummaryRequest req
    ) {
        Patient p = patientService.findByPhn(phn)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DischargeSummary summary = dsService.create(admId, p, req);

        return Map.of(
                "success", true,
                "id", summary.getId()
        );
    }



    @GetMapping("/pdf")
    public ResponseEntity<byte[]> getPdf(
            @PathVariable("phn") String phn,
            @PathVariable("admId") Long admId
    ) {
        Admission adm = admissionService.getById(admId);

        if (!adm.getPatient().getPhn().equals(phn)) {
            throw new RuntimeException("Admission does not belong to this patient");
        }

        DischargeSummary ds = adm.getDischargeSummary();
        if (ds == null) {
            throw new RuntimeException("Discharge summary not found");
        }

        byte[] pdf = pdfService.generateDischargeSummaryPdf(ds);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "attachment; filename=discharge-summary.pdf")
                .body(pdf);
    }
}