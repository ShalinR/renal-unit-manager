package com.peradeniya.renal.services;

import com.peradeniya.renal.model.KTSurgery;
import com.peradeniya.renal.repository.KTSurgeryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.repository.PatientRepository;

@Service
public class KTSurgeryService {

    private final KTSurgeryRepository repository;
    private final PatientRepository patientRepository;

    public KTSurgeryService(KTSurgeryRepository repository, PatientRepository patientRepository) {
        this.repository = repository;
        this.patientRepository = patientRepository;
    }

    public KTSurgery save(KTSurgery entity, String phn) {
        Patient patient = patientRepository.findByPhn(phn).orElseThrow(() -> new RuntimeException("Patient not found"));
        entity.setPatient(patient);
        return repository.save(entity);
    }

    public List<KTSurgery> getAll() {
        return repository.findAll();
    }

    public KTSurgery getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("KT Surgery not found"));
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
