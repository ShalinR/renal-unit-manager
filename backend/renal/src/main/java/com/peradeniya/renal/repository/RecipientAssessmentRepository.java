package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.RecipientAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipientAssessmentRepository extends JpaRepository<RecipientAssessment, Long> {

    @Query("SELECT ra FROM RecipientAssessment ra WHERE ra.patient.phn = :phn")
    List<RecipientAssessment> findByPatientPhn(String phn);
    List<RecipientAssessment> findByPatientPhnOrderByIdDesc(String phn);
    Optional<RecipientAssessment> findByIdAndPatientPhn(Long id, String phn);
}