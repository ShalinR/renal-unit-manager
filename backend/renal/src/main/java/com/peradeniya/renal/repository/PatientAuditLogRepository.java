package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.PatientAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PatientAuditLogRepository extends JpaRepository<PatientAuditLog, Long> {
    
    List<PatientAuditLog> findByPatientPhnOrderByTimestampDesc(String patientPhn);
    
    List<PatientAuditLog> findByUsernameOrderByTimestampDesc(String username);
    
    List<PatientAuditLog> findByActionOrderByTimestampDesc(String action);
    
    List<PatientAuditLog> findByTimestampBetweenOrderByTimestampDesc(
        LocalDateTime start, LocalDateTime end);
}

