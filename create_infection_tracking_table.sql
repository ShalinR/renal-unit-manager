-- Create table for infection tracking (handles all three types: Peritonitis, Exit Site, Tunnel)
CREATE TABLE IF NOT EXISTS infection_tracking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,
    infection_type VARCHAR(50) NOT NULL, -- 'PERITONITIS', 'EXIT_SITE', 'TUNNEL'
    episode_date VARCHAR(255),
    
    -- Peritonitis specific fields
    capd_full_reports TEXT,
    capd_culture VARCHAR(500),
    antibiotic_sensitivity VARCHAR(500),
    management_antibiotic VARCHAR(500),
    management_type VARCHAR(255),
    management_duration VARCHAR(255),
    outcome VARCHAR(500),
    reason_for_peritonitis VARCHAR(500),
    assessment_by_no TEXT,
    
    -- Exit Site specific fields
    date_onset VARCHAR(255),
    number_of_episodes VARCHAR(255),
    investigation_culture VARCHAR(500),
    investigation_exit_site VARCHAR(500),
    investigation_other VARCHAR(500),
    hospitalization_duration VARCHAR(255),
    reason_for_infection VARCHAR(500),
    special_remarks TEXT,
    assessment_by_doctor TEXT,
    
    -- Tunnel specific fields
    culture_report VARCHAR(500),
    treatment VARCHAR(500),
    remarks TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_infection_type (infection_type),
    INDEX idx_episode_date (episode_date)
);

