---

# Renal Care Unit Management System

## Overview

The **Renal Care Unit Management System** is a web application designed to manage and track patient care in renal units, including dialysis management, peritoneal dialysis, and kidney transplant operations. The system provides a streamlined workflow for healthcare staff to maintain patient records, monitor treatment schedules, and ensure timely follow-ups.

The backend is built using **Spring Boot** with **MySQL/PostgreSQL** support, while the frontend is developed in **React with TypeScript** for a responsive and interactive user interface.

---

## Features

* **Patient Management**
  * Register new patients and update medical records
  * Track patient history, treatment plans, and lab results

* **🏥 Ward Management**
  * Serves as the operational core of inpatient care within the Renal Care Unit.
  * Enables healthcare professionals to efficiently record, monitor, and manage all ward-level activities — from admission to discharge — ensuring accurate documentation and continuity of care.

  **Key Functionalities**
  * **Patient Admission & Discharge**
    * Register new admissions with detailed demographics, guardian information, and admission-related medical data.
    * Record type of admission (direct, referred, transferred, etc.) and maintain discharge summaries.

  * **Patient Details Overview**
    * View complete patient profiles including PHN, BHT number, MOH area, consultant name, and other demographic attributes.
    * Display guardian details and admission metadata in a structured, non-editable format.

  * **Medical Record Management**
    * Maintain digital records for Progress Notes, Medical History, and Allergic History.
    * Add new entries tagged with the doctor’s name and timestamp to ensure traceability.

  * **Investigations Module**
    * Categorized sections for Bio-Chemistry, Microbiology, Histopathology, Procedures, and Radiology.
    * Upload and view related images or reports directly under each category.

  * **Discharge & Admission Summary**
    * Generate and download discharge summaries as PDFs.
    * View admission history, active admissions, and previous summaries in the sidebar panel.

  **Technical Overview**
  * **Frontend:** React (TypeScript) + TailwindCSS + shadcn/ui  
  * **Backend:** Spring Boot REST APIs (planned integration)  
  * **Database:** MySQL for patient data and medical records  

* **Dialysis Unit Management**
  * Manage hemodialysis schedules and machine allocation
  * Monitor ongoing dialysis sessions

* **Peritoneal Dialysis Management**
  * Track patient peritoneal dialysis schedules
  * Record treatment details and complications

* **Kidney Transplant Management**
  * Register donors and recipients
  * Match donor-recipient pairs based on medical criteria
  * Track transplant progress and post-transplant follow-ups

* **Reporting & Analytics**
  * Generate treatment and patient reports
  * Track resource utilization

* **Authentication & Security**
  * Role-based access for staff members
  * Secure API endpoints

---

## Technology Stack

* **Backend**: Spring Boot, Spring Data JPA, Spring Security (optional for authentication)
* **Database**: MySQL or PostgreSQL
* **Frontend**: React with TypeScript, TailwindCSS, shadcn/ui components
* **APIs**: RESTful endpoints for all operations

---
