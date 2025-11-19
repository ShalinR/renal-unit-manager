package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.HemodialysisMonthlyReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HemodialysisMonthlyReviewRepository extends JpaRepository<HemodialysisMonthlyReview, Long> {
    
    List<HemodialysisMonthlyReview> findByPatientIdOrderByReviewDateDesc(String patientId);
    
    Optional<HemodialysisMonthlyReview> findByIdAndPatientId(Long id, String patientId);
}
