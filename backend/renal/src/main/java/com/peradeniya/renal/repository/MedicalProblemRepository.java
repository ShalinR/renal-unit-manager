package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.MedicalProblem;
import com.peradeniya.renal.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalProblemRepository extends JpaRepository<MedicalProblem, Long> {
    List<MedicalProblem> findByPatient(Patient patient);
    List<MedicalProblem> findByPatientPhn(String phn);
}
