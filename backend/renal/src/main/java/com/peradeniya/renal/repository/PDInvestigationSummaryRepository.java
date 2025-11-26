package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.PDInvestigationSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PDInvestigationSummaryRepository extends JpaRepository<PDInvestigationSummary, Long> {
    List<PDInvestigationSummary> findByPatientIdOrderByCreatedAtDesc(String patientId);
}

