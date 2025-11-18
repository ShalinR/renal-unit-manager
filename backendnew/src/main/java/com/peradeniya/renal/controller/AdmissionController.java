package com.peradeniya.renal.controller;

import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.service.AdmissionService;
import com.peradeniya.renal.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients/{phn}/admissions")
@RequiredArgsConstructor
public class AdmissionController {

    private final PatientService patientService;
    private final AdmissionService admissionService;

    @GetMapping
    public List<Admission> getAdmissions(@PathVariable String phn) {
        Patient p = patientService.findByPhn(phn).orElseThrow(() ->
                new RuntimeException("Patient not found"));
        return admissionService.getAdmissionsForPatient(p);
    }
}
