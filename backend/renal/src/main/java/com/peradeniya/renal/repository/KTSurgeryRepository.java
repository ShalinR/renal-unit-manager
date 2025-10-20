package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.KTSurgery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KTSurgeryRepository extends JpaRepository<KTSurgery, Long> {}
