package com.peradeniya.renal.service;

import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.repository.AdmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdmissionService {

    private final AdmissionRepository admissionRepo;

    public List<Admission> getAdmissionsForPatient(Patient p) {
        return admissionRepo.findByPatientIdOrderByNumberDesc(p.getId());
    }

    public Admission getById(Long id) {
        return admissionRepo.findById(id).orElseThrow();
    }
}
