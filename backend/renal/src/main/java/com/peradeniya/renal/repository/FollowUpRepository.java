package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.FollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {

    @Query("SELECT f FROM FollowUp f WHERE f.patient.phn = :phn")
    List<FollowUp> findByPatientPhn(@Param("phn") String phn);
}