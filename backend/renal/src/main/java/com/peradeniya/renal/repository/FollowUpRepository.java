package com.peradeniya.renal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.peradeniya.renal.model.FollowUp;

import java.util.List;

public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {
    List<FollowUp> findByPatientPhn(String phn);
}
