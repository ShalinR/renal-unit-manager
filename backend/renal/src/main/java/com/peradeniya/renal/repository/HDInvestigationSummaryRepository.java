package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.HDInvestigationSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HDInvestigationSummaryRepository extends JpaRepository<HDInvestigationSummary, Long> {
    List<HDInvestigationSummary> findByPatientIdOrderByCreatedAtDesc(String patientId);
}

