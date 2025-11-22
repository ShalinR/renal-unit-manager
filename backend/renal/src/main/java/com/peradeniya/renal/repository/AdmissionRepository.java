package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, Long> {
    
    List<Admission> findByPatientOrderByAdmittedOnDesc(Patient patient);
    
    // FIXED: Use correct field name - 'active' not 'Active'
    Optional<Admission> findByPatientAndActiveTrue(Patient patient);
    
    List<Admission> findByPatientPhnOrderByAdmittedOnDesc(String phn);
    
    List<Admission> findByPatient(Patient patient);
}