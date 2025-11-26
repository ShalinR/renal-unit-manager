package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.DonorAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorAssessmentRepository extends JpaRepository<DonorAssessment, Long> {

    @Query("SELECT da FROM DonorAssessment da WHERE da.patient.phn = :phn")
    List<DonorAssessment> findByPatientPhn(@Param("phn") String phn);

    Optional<DonorAssessment> findByIdAndPatientPhn(Long id, String phn);

    // NEW: Find donors by status
    List<DonorAssessment> findByStatus(String status);

    // NEW: Find assigned donor for a recipient
    @Query("SELECT da FROM DonorAssessment da WHERE da.assignedRecipientPhn = :recipientPhn AND da.status = 'assigned'")
    Optional<DonorAssessment> findAssignedDonorByRecipientPhn(@Param("recipientPhn") String recipientPhn);
}