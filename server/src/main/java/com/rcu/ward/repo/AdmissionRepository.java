package com.rcu.ward.repo;

import com.rcu.ward.model.Admission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdmissionRepository extends JpaRepository<Admission, Long> {
  Optional<Admission> findByBht(String bht);
}
