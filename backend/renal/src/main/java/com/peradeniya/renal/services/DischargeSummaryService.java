package com.peradeniya.renal.services;

import com.peradeniya.renal.model.DischargeSummary;
import com.peradeniya.renal.model.WardAdmission;
import com.peradeniya.renal.repository.DischargeSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DischargeSummaryService {

    private final DischargeSummaryRepository dischargeSummaryRepository;

    public DischargeSummary saveSummary(DischargeSummary summary) {
        return dischargeSummaryRepository.save(summary);
    }

    public Optional<DischargeSummary> getByAdmission(WardAdmission admission) {
        return dischargeSummaryRepository.findByAdmission(admission);
    }

    public List<DischargeSummary> getAll() {
        return dischargeSummaryRepository.findAll();
    }
}
