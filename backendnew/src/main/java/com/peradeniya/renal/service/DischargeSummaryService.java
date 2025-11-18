package com.peradeniya.renal.service;

import com.peradeniya.renal.dto.DischargeSummaryRequest;
import com.peradeniya.renal.model.*;
import com.peradeniya.renal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DischargeSummaryService {

    private final DischargeSummaryRepository dsRepo;
    private final AdmissionRepository admissionRepo;

    public DischargeSummary create(Long admissionId, Patient patient, DischargeSummaryRequest r) {

        Admission adm = admissionRepo.findById(admissionId).orElseThrow();

        DischargeSummary ds = DischargeSummary.builder()
                .admission(adm)
                .patient(patient)
                .dischargeDate(r.getDischargeDate())
                .diagnosis(r.getDiagnosis())
                .icd10(r.getIcd10())
                .progressSummary(r.getProgressSummary())
                .management(r.getManagement())
                .dischargePlan(r.getDischargePlan())
                .drugsFreeHand(r.getDrugsFreeHand())
                .build();

        adm.setDischargeSummaryAvailable(true);
        admissionRepo.save(adm);

        return dsRepo.save(ds);
    }
}
