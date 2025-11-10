package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.InfectionTrackingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InfectionTrackingRepository extends JpaRepository<InfectionTrackingEntity, Long> {
    
    List<InfectionTrackingEntity> findByPatientIdAndInfectionTypeOrderByEpisodeDateDesc(String patientId, String infectionType);
    
    List<InfectionTrackingEntity> findByPatientIdOrderByEpisodeDateDesc(String patientId);
}

