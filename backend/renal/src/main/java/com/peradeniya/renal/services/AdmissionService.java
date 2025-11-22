package com.peradeniya.renal.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.peradeniya.renal.dto.PatientCreateRequest;
import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.repository.AdmissionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdmissionService {

    private final AdmissionRepository admissionRepository;

    public Admission createAdmission(Patient patient, PatientCreateRequest request) {
        System.out.println("➕ Creating admission for patient: " + patient.getPhn());
        
        Admission admission = new Admission();
        admission.setPatient(patient);
        admission.setWard(request.getWard());
        admission.setWardNumber(request.getWardNumber());
        admission.setBedId(request.getBedId());
        admission.setAdmittedOn(request.getAdmissionDate());
        
        LocalDateTime admissionTime = request.getAdmissionTimeAsLocalDateTime();
        if (admissionTime != null) {
            admission.setAdmissionTime(admissionTime);
            System.out.println("⏰ Setting admission time to: " + admissionTime);
        } else {
            admission.setAdmissionTime(LocalDateTime.now());
            System.out.println("⏰ Using current time for admission");
        }
        
        admission.setAdmissionType(request.getAdmissionType());
        admission.setConsultantName(request.getConsultantName());
        admission.setReferredBy(request.getReferredBy());
        admission.setPrimaryDiagnosis(request.getPrimaryDiagnosis());
        admission.setAdmittingOfficer(request.getAdmittingOfficer());
        admission.setPresentingComplaints(request.getPresentingComplaints());

        admission.setExamTempC(request.getTempC());
        admission.setExamHeightCm(request.getHeightCm());
        admission.setExamWeightKg(request.getWeightKg());
        admission.setExamBMI(request.getBmi());
        admission.setExamBloodPressure(request.getBloodPressure());
        admission.setExamHeartRate(request.getHeartRate());

        // Generate BHT number and set admission number
        String bhtNumber = "BHT-" + patient.getPhn() + "-" + System.currentTimeMillis();
        admission.setBhtNumber(bhtNumber);
        admission.setNumber(1); // First admission
        
        // FIXED: Set both active flags properly
        admission.setActive(true);
        admission.setDischargeSummaryAvailable(false);

        Admission savedAdmission = admissionRepository.save(admission);
        System.out.println("✅ Admission created with ID: " + savedAdmission.getId() + 
                          ", BHT: " + savedAdmission.getBhtNumber() + 
                          ", Active: " + savedAdmission.isActive());
        return savedAdmission;
    }

    public Admission getById(Long id) {
        return admissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission not found with id: " + id));
    }

    public List<Admission> getAdmissionsByPatientPhn(String phn) {
        String cleanPhn = phn.replaceAll("[^0-9]", "");
        System.out.println("📥 Getting admissions for PHN: " + cleanPhn);
        return admissionRepository.findByPatientPhnOrderByAdmittedOnDesc(cleanPhn);
    }

    public Optional<Admission> getActiveAdmission(Patient patient) {
        System.out.println("🔍 Repository query for active admission - Patient ID: " + patient.getId() + ", PHN: " + patient.getPhn());
        Optional<Admission> result = admissionRepository.findByPatientAndActiveTrue(patient);
        System.out.println("🔍 Active admission found: " + result.isPresent());
        if (result.isPresent()) {
            System.out.println("🔍 Admission details - ID: " + result.get().getId() + ", Active: " + result.get().isActive());
        }
        return result;
    }

    public List<Admission> getAdmissionsForPatient(Patient patient) {
        System.out.println("📋 Getting all admissions for patient: " + patient.getPhn());
        List<Admission> admissions = admissionRepository.findByPatientOrderByAdmittedOnDesc(patient);
        System.out.println("📋 Found " + admissions.size() + " admissions");
        admissions.forEach(adm -> System.out.println("   - ID: " + adm.getId() + ", Active: " + adm.isActive() + ", BHT: " + adm.getBhtNumber()));
        return admissions;
    }

    public Admission save(Admission admission) {
        return admissionRepository.save(admission);
    }
}