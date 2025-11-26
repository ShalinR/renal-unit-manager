package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.DischargeSummaryRequest;
import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.DischargeSummary;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.repository.DischargeSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DischargeSummaryService {

    private final DischargeSummaryRepository dischargeSummaryRepository;
    private final AdmissionService admissionService;

    public DischargeSummary create(Long admissionId, Patient patient, DischargeSummaryRequest req) {
        System.out.println("Creating discharge summary for admission: " + admissionId);
        System.out.println("Request data: " + req);
        
        Admission admission = admissionService.getById(admissionId);
        
        if (!admission.getPatient().getId().equals(patient.getId())) {
            throw new RuntimeException("Admission does not belong to patient");
        }

        DischargeSummary ds = new DischargeSummary();
        ds.setAdmission(admission);
        ds.setPatient(patient);
        
        // Parse discharge date
        LocalDate dischargeDate = req.getDischargeDateAsLocalDate();
        if (dischargeDate != null) {
            ds.setDischargeDate(dischargeDate);
            System.out.println("Set discharge date to: " + dischargeDate);
        } else {
            ds.setDischargeDate(LocalDate.now());
            System.out.println("Using current date as discharge date");
        }
        
        ds.setDiagnosis(req.getDiagnosis());
        ds.setIcd10(req.getIcd10());
        ds.setProgressSummary(req.getProgressSummary());
        ds.setManagement(req.getManagement());
        ds.setDischargePlan(req.getDischargePlan());
        ds.setDrugsFreeHand(req.getDrugsFreeHand());

        DischargeSummary savedDs = dischargeSummaryRepository.save(ds);
        
        // Update admission to mark as having discharge summary
        admission.setDischargeSummaryAvailable(true); 
        admission.setActive(false);
        admissionService.save(admission); // You'll need to add this method to AdmissionService
        
        System.out.println("Discharge summary created with ID: " + savedDs.getId());
        return savedDs;
    }
}