package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.CapdSummaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CapdSummaryRepository extends JpaRepository<CapdSummaryEntity, Long> {

    // Spring Data JPA automatically creates the query for us
    // "SELECT * FROM capd_summary WHERE patient_id = ?"
    Optional<CapdSummaryEntity> findByPatientId(String patientId);
}
