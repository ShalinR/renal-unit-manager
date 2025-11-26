package com.peradeniya.renal.services;

import com.peradeniya.renal.model.MedicalProblem;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.repository.MedicalProblemRepository;
import com.peradeniya.renal.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalProblemService {

    private final MedicalProblemRepository repository;
    private final PatientRepository patientRepository;

    public List<String> getMedicalProblemsByPatientPhn(String phn) {
        return repository.findByPatientPhn(phn).stream()
                .map(MedicalProblem::getProblem)
                .collect(Collectors.toList());
    }

    public void updateMedicalProblems(String phn, List<String> problems) {
        String cleanPhn = phn.replaceAll("[^0-9]", "");
        Patient patient = patientRepository.findByPhn(cleanPhn)
                .orElseThrow(() -> new RuntimeException("Patient not found with PHN: " + cleanPhn));

        // Delete existing problems
        List<MedicalProblem> existing = repository.findByPatient(patient);
        repository.deleteAll(existing);

        // Add new problems
        for (String problem : problems) {
            if (!problem.trim().isEmpty()) {
                MedicalProblem mp = MedicalProblem.builder()
                        .problem(problem.trim())
                        .patient(patient)
                        .build();
                repository.save(mp);
            }
        }
    }
}