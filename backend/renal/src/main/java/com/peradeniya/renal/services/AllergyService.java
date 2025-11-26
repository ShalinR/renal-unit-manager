package com.peradeniya.renal.services;

import com.peradeniya.renal.model.Allergy;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.repository.AllergyRepository;
import com.peradeniya.renal.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AllergyService {

    private final AllergyRepository repository;
    private final PatientRepository patientRepository;

    public List<String> getAllergiesByPatientPhn(String phn) {
        return repository.findByPatientPhn(phn).stream()
                .map(Allergy::getAllergy)
                .collect(Collectors.toList());
    }

    public void updateAllergies(String phn, List<String> allergies) {
        String cleanPhn = phn.replaceAll("[^0-9]", "");
        Patient patient = patientRepository.findByPhn(cleanPhn)
                .orElseThrow(() -> new RuntimeException("Patient not found with PHN: " + cleanPhn));

        // Delete existing allergies
        List<Allergy> existing = repository.findByPatient(patient);
        repository.deleteAll(existing);

        // Add new allergies
        for (String allergy : allergies) {
            if (!allergy.trim().isEmpty()) {
                Allergy a = Allergy.builder()
                        .allergy(allergy.trim())
                        .patient(patient)
                        .build();
                repository.save(a);
            }
        }
    }
}