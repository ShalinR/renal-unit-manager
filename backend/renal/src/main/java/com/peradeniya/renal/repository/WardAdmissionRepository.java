package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.WardAdmission;
import com.peradeniya.renal.model.AdmissionStatus;
import com.peradeniya.renal.model.PatientRegistrationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WardAdmissionRepository extends JpaRepository<WardAdmission, Long> {

    Optional<WardAdmission> findByBhtNumber(String bhtNumber);

    List<WardAdmission> findByPatient(PatientRegistrationEntity patient);

    List<WardAdmission> findByPatientAndStatus(PatientRegistrationEntity patient, AdmissionStatus status);
}
