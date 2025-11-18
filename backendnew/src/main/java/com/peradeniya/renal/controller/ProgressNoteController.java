package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.ProgressNoteRequest;
import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.model.ProgressNote;
import com.peradeniya.renal.service.AdmissionService;
import com.peradeniya.renal.service.PatientService;
import com.peradeniya.renal.service.ProgressNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patients/{phn}/admissions/{admId}/progress-notes")
@RequiredArgsConstructor
public class ProgressNoteController {

    private final PatientService patientService;
    private final AdmissionService admissionService;
    private final ProgressNoteService progressNoteService;

    @PostMapping
    public ProgressNote addNote(
            @PathVariable String phn,
            @PathVariable Long admId,
            @RequestBody ProgressNoteRequest req
    ) {
        Patient p = patientService.findByPhn(phn)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Admission admission = admissionService.getById(admId);

        if (!admission.getPatient().getId().equals(p.getId()))
            throw new RuntimeException("Admission does not belong to patient");

        return progressNoteService.addNote(admission, req);
    }
}
