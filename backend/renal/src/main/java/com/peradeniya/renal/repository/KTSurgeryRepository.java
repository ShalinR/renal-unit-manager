package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.KTSurgery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KTSurgeryRepository extends JpaRepository<KTSurgery, Long> {

    Optional<KTSurgery> findByPatientPhn(String patientPhn);

    List<KTSurgery> findAllByPatientPhn(String patientPhn);

    @Query("SELECT k FROM KTSurgery k WHERE k.patientPhn = :phn ORDER BY k.ktDate DESC")
    List<KTSurgery> findByPatientPhnOrderByKtDateDesc(@Param("phn") String phn);

    boolean existsByPatientPhn(String patientPhn);
}