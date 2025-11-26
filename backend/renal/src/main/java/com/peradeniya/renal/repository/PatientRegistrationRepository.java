package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.PeriPatientRegistrationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRegistrationRepository extends JpaRepository<PeriPatientRegistrationEntity, Long> {
    Optional<PeriPatientRegistrationEntity> findByPatientId(String patientId);
}


















