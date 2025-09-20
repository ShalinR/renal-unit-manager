package com.rcu.ward.repo;

import com.rcu.ward.model.Guardian;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuardianRepository extends JpaRepository<Guardian, Long> {}
