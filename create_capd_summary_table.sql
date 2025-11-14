-- SQL script to create the capd_summary table for storing peritoneal dialysis CAPD summary data
-- Run this script in your MySQL database to create the table structure

CREATE TABLE IF NOT EXISTS capd_summary (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(255) UNIQUE NOT NULL,
    counselling_date VARCHAR(255),
    catheter_insertion_date VARCHAR(255),
    insertion_done_by VARCHAR(255),
    insertion_place VARCHAR(255),
    first_flushing VARCHAR(255),
    second_flushing VARCHAR(255),
    third_flushing VARCHAR(255),
    initiation_date VARCHAR(255),
    pet_results_json TEXT,
    adequacy_results_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create an index on patient_id for faster lookups
CREATE INDEX idx_patient_id ON capd_summary(patient_id);

