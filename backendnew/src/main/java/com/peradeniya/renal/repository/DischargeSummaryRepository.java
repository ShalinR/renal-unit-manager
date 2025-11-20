package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.DischargeSummary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DischargeSummaryRepository extends JpaRepository<DischargeSummary, Long> {
    DischargeSummary findByAdmissionId(Long admissionId);
}
