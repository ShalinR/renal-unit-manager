package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.MonthlyAssessmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlyAssessmentRepository extends JpaRepository<MonthlyAssessmentEntity, Long> {
    
    List<MonthlyAssessmentEntity> findByPatientIdOrderByAssessmentDateDesc(String patientId);
    
    Optional<MonthlyAssessmentEntity> findByIdAndPatientId(Long id, String patientId);
}

