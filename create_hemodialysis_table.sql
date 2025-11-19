-- SQL to create hemodialysis_record table
CREATE TABLE IF NOT EXISTS hemodialysis_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,
    session_date VARCHAR(255) NOT NULL,
    prescription_json TEXT,
    vascular_access_json TEXT,
    session_json TEXT,
    other_notes TEXT,
    filled_by VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_patient_id (patient_id),
    INDEX idx_session_date (session_date)
);
