package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.Allergy;
import com.peradeniya.renal.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AllergyRepository extends JpaRepository<Allergy, Long> {
    List<Allergy> findByPatient(Patient patient);
    List<Allergy> findByPatientPhn(String phn);
}
