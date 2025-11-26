package com.peradeniya.renal.controller;

import com.peradeniya.renal.services.AllergyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients/{phn}/allergies")
@RequiredArgsConstructor
public class AllergyController {

    private final AllergyService service;

    @GetMapping
    public List<String> getAllergies(@PathVariable String phn) {
        return service.getAllergiesByPatientPhn(phn);
    }

    @PutMapping
    public void updateAllergies(@PathVariable String phn, @RequestBody List<String> allergies) {
        service.updateAllergies(phn, allergies);
    }
}