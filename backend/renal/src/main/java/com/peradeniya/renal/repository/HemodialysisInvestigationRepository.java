package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.HemodialysisInvestigation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HemodialysisInvestigationRepository extends JpaRepository<HemodialysisInvestigation, Long> {
    
    List<HemodialysisInvestigation> findByPatientIdOrderByInvestigationDateDesc(String patientId);
    
    Optional<HemodialysisInvestigation> findByIdAndPatientId(Long id, String patientId);

    List<HemodialysisInvestigation> findByMonthlyReviewIdOrderByInvestigationDateDesc(Long monthlyReviewId);

    Optional<HemodialysisInvestigation> findByIdAndMonthlyReviewId(Long id, Long monthlyReviewId);
}
