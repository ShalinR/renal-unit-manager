package com.peradeniya.renal.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.peradeniya.renal.dto.DischargeSummaryRequest;
import com.peradeniya.renal.model.DischargeSummary;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.services.AdmissionService;
import com.peradeniya.renal.services.DischargeSummaryService;
import com.peradeniya.renal.services.PatientService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/patients/{phn}/admissions/{admId}/discharge-summary")
@RequiredArgsConstructor
public class DischargeSummaryController {

    private final PatientService patientService;
    private final AdmissionService admissionService;
    private final DischargeSummaryService dsService;
    // private final PdfService pdfService;

    @PostMapping
    public DischargeSummary create(
            @PathVariable("phn") String phn,
            @PathVariable("admId") Long admId,
            @RequestBody DischargeSummaryRequest req
    ) {
        System.out.println("Creating discharge summary for PHN: " + phn + ", Admission: " + admId);
        System.out.println("Discharge summary payload: " + req);
        
        Patient p = patientService.findByPhn(phn)
                .orElseThrow(() -> new RuntimeException("Patient not found with PHN: " + phn));
        return dsService.create(admId, p, req);
    }

    // @GetMapping("/pdf")
    // public ResponseEntity<byte[]> getPdf(
    //         @PathVariable("phn") String phn,
    //         @PathVariable("admId") Long admId
    // ) {
    //     System.out.println("Generating PDF for discharge summary - PHN: " + phn + ", Admission: " + admId);
        
    //     Admission adm = admissionService.getById(admId);

    //     if (!adm.getPatient().getPhn().equals(phn))
    //         throw new RuntimeException("Admission not linked to patient");

    //     DischargeSummary ds = adm.getDischargeSummary();
    //     if (ds == null)
    //         throw new RuntimeException("Discharge summary not found");

    //     // byte[] pdf = pdfService.generateDischargeSummaryPdf(ds);

    //     return ResponseEntity.ok()
    //             .contentType(MediaType.APPLICATION_PDF)
    //             .header("Content-Disposition", "attachment; filename=discharge-summary.pdf")
    //             .body(pdf);
    // }
}