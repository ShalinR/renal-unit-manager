package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.Admission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdmissionRepository extends JpaRepository<Admission, Long> {
    List<Admission> findByPatientIdOrderByNumberDesc(Long patientId);
    Admission findByBhtNumber(String bhtNumber);
}
