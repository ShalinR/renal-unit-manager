package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.Investigation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface InvestigationRepository extends JpaRepository<Investigation, Long> {

    @Query("SELECT i FROM Investigation i WHERE i.patient.phn = :phn ORDER BY i.date DESC")
    List<Investigation> findByPatientPhn(@Param("phn") String phn);

    @Query("SELECT i FROM Investigation i WHERE i.patient.phn = :phn AND i.type = :type ORDER BY i.date DESC")
    List<Investigation> findByPatientPhnAndType(@Param("phn") String phn, @Param("type") String type);

    @Query("SELECT i FROM Investigation i WHERE i.patient.phn = :phn AND i.date = :date ORDER BY i.createdAt DESC")
    List<Investigation> findByPatientPhnAndDate(@Param("phn") String phn, @Param("date") String date);

    @Query("SELECT i FROM Investigation i WHERE i.patient.phn = :phn AND i.type = :type AND i.date = :date")
    List<Investigation> findByPatientPhnAndTypeAndDate(@Param("phn") String phn, @Param("type") String type, @Param("date") String date);
}