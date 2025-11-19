package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.HemodialysisRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HemodialysisRecordRepository extends JpaRepository<HemodialysisRecord, Long> {
    List<HemodialysisRecord> findByPatientIdOrderByHemoDialysisSessionDateDesc(String patientId);
    
    List<HemodialysisRecord> findByPatientIdAndHemoDialysisSessionDate(String patientId, String hemoDialysisSessionDate);
}

