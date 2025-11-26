package com.peradeniya.renal.controller;

import com.peradeniya.renal.services.MedicalProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients/{phn}/medical-problems")
@RequiredArgsConstructor
public class MedicalProblemController {

    private final MedicalProblemService service;

    @GetMapping
    public List<String> getMedicalProblems(@PathVariable String phn) {
        return service.getMedicalProblemsByPatientPhn(phn);
    }

    @PutMapping
    public void updateMedicalProblems(@PathVariable String phn, @RequestBody List<String> problems) {
        service.updateMedicalProblems(phn, problems);
    }
}