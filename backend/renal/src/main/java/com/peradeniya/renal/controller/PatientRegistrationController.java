package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.PatientRegistrationDto;
import com.peradeniya.renal.services.PatientRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient-registration")
@CrossOrigin(origins = "http://localhost:5173") // Match your React app's origin
public class PatientRegistrationController {

    private final PatientRegistrationService registrationService;

    @Autowired
    public PatientRegistrationController(PatientRegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping("/{patientId}")
    public PatientRegistrationDto getPatientRegistration(@PathVariable String patientId) {
        System.out.println("GET request received for patient registration: " + patientId);
        return registrationService.getPatientRegistrationByPatientId(patientId);
    }

    @PostMapping("/{patientId}")
    public PatientRegistrationDto savePatientRegistration(@PathVariable String patientId, @RequestBody PatientRegistrationDto registrationData) {
        System.out.println("POST request received for patient registration: " + patientId);
        return registrationService.savePatientRegistration(patientId, registrationData);
    }
}

















