package com.peradeniya.renal.controller;

import com.peradeniya.renal.model.*;
import com.peradeniya.renal.repository.*;
import com.peradeniya.renal.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ward/admissions")
@CrossOrigin(origins = "http://localhost:5173")
public class WardAdmissionController {

    @Autowired
    private WardAdmissionService admissionService;

    @Autowired
    private PatientRegistrationRepository patientRepo;

    // --------------------------------------------
    // 1. GET Patient + Admissions by PHN
    // --------------------------------------------
    @GetMapping("/patient/{phn}")
    public WardAdmissionService.PatientWithAdmissionsDTO getByPhn(@PathVariable String phn) {
        return admissionService.getPatientWithAdmissions(phn);
    }

    // --------------------------------------------
    // 2. CREATE Admission for a patient
    // --------------------------------------------
    @PostMapping("/create")
    public WardAdmission createAdmission(@RequestBody WardAdmission admission) {
        return admissionService.createAdmission(admission);
    }

    // --------------------------------------------
    // 3. GET all admissions for a patient
    // --------------------------------------------
    @GetMapping("/list/{phn}")
    public List<WardAdmission> listAdmissions(@PathVariable String phn) {
        PatientRegistrationEntity patient =
                patientRepo.findByPhn(phn).orElseThrow(() -> new RuntimeException("Patient not found"));
        return admissionService.getAdmissionsForPatient(patient);
    }

    // --------------------------------------------
    // 4. DISCHARGE a patient
    // --------------------------------------------
    @PostMapping("/discharge/{bht}")
    public WardAdmission discharge(@PathVariable String bht) {
        return admissionService.dischargePatient(bht);
    }
}
