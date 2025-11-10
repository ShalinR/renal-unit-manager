-- Create table for monthly assessments
CREATE TABLE IF NOT EXISTS monthly_assessment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,
    assessment_date VARCHAR(255) NOT NULL,
    exit_site VARCHAR(500),
    residual_urine_output VARCHAR(255),
    pd_balance VARCHAR(255),
    body_weight VARCHAR(255),
    blood_pressure VARCHAR(255),
    number_of_exchanges VARCHAR(255),
    total_balance VARCHAR(255),
    shortness_of_breath BOOLEAN,
    edema BOOLEAN,
    iv_iron VARCHAR(500),
    erythropoietin VARCHAR(500),
    capd_prescription_apd_plan BOOLEAN,
    hand_washing_technique BOOLEAN,
    capd_prescription VARCHAR(255),
    catheter_components_in_order BOOLEAN,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_patient_id (patient_id),
    INDEX idx_assessment_date (assessment_date)
);

