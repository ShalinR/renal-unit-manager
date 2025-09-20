package com.rcu.ward.repo;

import com.rcu.ward.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {}
