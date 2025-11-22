package com.peradeniya.renal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.peradeniya.renal.dto.ProgressNoteRequest;
import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.model.ProgressNote;
import com.peradeniya.renal.services.AdmissionService;
import com.peradeniya.renal.services.PatientService;
import com.peradeniya.renal.services.ProgressNoteService;

@RestController
@RequestMapping("/api/patients/{phn}/admissions/{admId}/progress-notes")
// @RequiredArgsConstructor
public class ProgressNoteController {

    private final PatientService patientService;
    private final AdmissionService admissionService;
    private final ProgressNoteService progressNoteService;

    // Constructor injection (Spring will autowire this)
    @Autowired
    public ProgressNoteController(PatientService patientService, AdmissionService admissionService, ProgressNoteService progressNoteService) {
        this.patientService = patientService;
        this.admissionService = admissionService;
        this.progressNoteService = progressNoteService;
    }
    
    @PostMapping
    public ProgressNote addNote(
            @PathVariable("phn") String phn,
            @PathVariable("admId") Long admId,
            @RequestBody ProgressNoteRequest req
    ) {
        System.out.println("Adding progress note for PHN: " + phn + ", Admission: " + admId);
        System.out.println("Progress note payload: " + req);
        
        String cleanPhn = phn.replaceAll("[^0-9]", "");
        Patient p = patientService.findByPhn(cleanPhn)
                .orElseThrow(() -> new RuntimeException("Patient not found with PHN: " + cleanPhn));

        Admission admission = admissionService.getById(admId);

        if (admission == null) {
            throw new RuntimeException("Admission not found: " + admId);
        }

        if (admission.getPatient() == null || !admission.getPatient().getId().equals(p.getId()))
            throw new RuntimeException("Admission does not belong to patient");

        return progressNoteService.addNote(admission, req);
    }

    @GetMapping
    public List<ProgressNote> getNotes(
            @PathVariable("phn") String phn,
            @PathVariable("admId") Long admId
    ) {
        System.out.println("Getting progress notes for PHN: " + phn + ", Admission: " + admId);
        
        String cleanPhn = phn.replaceAll("[^0-9]", "");
        Patient p = patientService.findByPhn(cleanPhn)
                .orElseThrow(() -> new RuntimeException("Patient not found with PHN: " + cleanPhn));

        Admission admission = admissionService.getById(admId);

        if (admission == null) {
            throw new RuntimeException("Admission not found: " + admId);
        }

        if (admission.getPatient() == null || !admission.getPatient().getId().equals(p.getId()))
            throw new RuntimeException("Admission does not belong to patient");

        return progressNoteService.getNotesForAdmission(admId);
    }
}