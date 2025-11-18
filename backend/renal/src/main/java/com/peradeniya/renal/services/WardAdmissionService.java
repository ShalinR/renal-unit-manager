package com.peradeniya.renal.services;

import com.peradeniya.renal.model.*;
import com.peradeniya.renal.repository.WardAdmissionRepository;
import com.peradeniya.renal.repository.PatientRegistrationEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WardAdmissionService {

    private final WardAdmissionRepository wardAdmissionRepository;
    private final PatientRegistrationEntityRepository patientRepository;

    public Optional<WardAdmission> getActiveAdmissionByPhn(String phn) {
        PatientRegistrationEntity patient = patientRepository.findByPhn(phn).orElse(null);
        if (patient == null) return Optional.empty();

        List<WardAdmission> active = wardAdmissionRepository
                .findByPatientAndStatus(patient, AdmissionStatus.ADMITTED);

        if (active.isEmpty()) return Optional.empty();
        return Optional.of(active.get(0));
    }

    public List<WardAdmission> getAllAdmissionsByPhn(String phn) {
        PatientRegistrationEntity patient = patientRepository.findByPhn(phn).orElse(null);
        if (patient == null) return List.of();

        return wardAdmissionRepository.findByPatient(patient);
    }

    public WardAdmission admitPatient(String phn, WardAdmission admissionData) {
        PatientRegistrationEntity patient = patientRepository.findByPhn(phn)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        admissionData.setPatient(patient);
        admissionData.setStatus(AdmissionStatus.ADMITTED);
        admissionData.setHasDischargeSummary(false);
        admissionData.setAdmissionDate(LocalDate.now());

        return wardAdmissionRepository.save(admissionData);
    }

    public WardAdmission discharge(Long admissionId) {
        WardAdmission admission = wardAdmissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found"));

        admission.setStatus(AdmissionStatus.DISCHARGED);
        admission.setDischargeDate(LocalDate.now());

        return wardAdmissionRepository.save(admission);
    }
}
