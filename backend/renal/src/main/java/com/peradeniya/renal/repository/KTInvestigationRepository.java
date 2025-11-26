package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.KTInvestigation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface KTInvestigationRepository extends JpaRepository<KTInvestigation, Long> {

    @Query("SELECT k FROM KTInvestigation k WHERE k.patient.phn = :phn")
    List<KTInvestigation> findByPatientPhn(@Param("phn") String phn);
}