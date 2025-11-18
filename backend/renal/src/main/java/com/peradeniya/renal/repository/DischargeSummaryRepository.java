package com.peradeniya.renal.services;

import com.peradeniya.renal.model.*;
import com.peradeniya.renal.repository.DischargeSummaryRepository;
import com.peradeniya.renal.repository.WardAdmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class DischargeSummaryService {

    private final DischargeSummaryRepository dischargeSummaryRepository;
    private final WardAdmissionRepository wardAdmissionRepository;

    public DischargeSummary createSummary(Long admissionId, DischargeSummary summary) {
        WardAdmission admission = wardAdmissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found"));

        summary.setAdmission(admission);
        summary.setDate(LocalDate.now());
        summary.setTime(LocalTime.now());

        // update admission table
        admission.setHasDischargeSummary(true);

        return dischargeSummaryRepository.save(summary);
    }

    public DischargeSummary getSummary(Long admissionId) {
        return dischargeSummaryRepository.findByAdmissionId(admissionId)
                .orElse(null);
    }
}
