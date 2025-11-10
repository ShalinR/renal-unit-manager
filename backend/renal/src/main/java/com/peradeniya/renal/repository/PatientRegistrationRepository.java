package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.PatientRegistrationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRegistrationRepository extends JpaRepository<PatientRegistrationEntity, Long> {
    Optional<PatientRegistrationEntity> findByPatientId(String patientId);
}














