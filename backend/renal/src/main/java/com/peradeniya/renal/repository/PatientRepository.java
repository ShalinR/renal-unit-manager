package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByPhn(String phn);

    List<Patient> findByNameContainingIgnoreCase(String name);

    List<Patient> findByNicNoContaining(String nic);

    @Query("SELECT p FROM Patient p WHERE p.phn LIKE %:searchTerm% OR p.name LIKE %:searchTerm% OR p.nicNo LIKE %:searchTerm%")
    List<Patient> searchPatients(@Param("searchTerm") String searchTerm);

    boolean existsByPhn(String phn);

    boolean existsByNicNo(String nicNo);
}