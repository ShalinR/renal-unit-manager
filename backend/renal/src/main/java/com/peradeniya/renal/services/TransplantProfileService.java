package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.TransplantProfileDTO;
import com.peradeniya.renal.model.*;
import com.peradeniya.renal.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Comparator;

@Service
public class TransplantProfileService {

    private final PatientRepository patientRepository;
    private final RecipientAssessmentRepository recipientAssessmentRepository;
    private final DonorAssessmentRepository donorAssessmentRepository;

    public TransplantProfileService(PatientRepository patientRepository,
                                    RecipientAssessmentRepository recipientAssessmentRepository,
                                    DonorAssessmentRepository donorAssessmentRepository) {
        this.patientRepository = patientRepository;
        this.recipientAssessmentRepository = recipientAssessmentRepository;
        this.donorAssessmentRepository = donorAssessmentRepository;
    }

    public TransplantProfileDTO getTransplantProfile(String phn) {
        TransplantProfileDTO profile = new TransplantProfileDTO();

        // Get patient basic info
        patientRepository.findByPhn(phn).ifPresent(profile::setPatient);

        // Get recipient assessment (latest)
        List<RecipientAssessment> recipientAssessments = recipientAssessmentRepository.findByPatientPhnOrderByIdDesc(phn);
        if (!recipientAssessments.isEmpty()) {
            profile.setRecipientAssessment(recipientAssessments.get(0));
        }

        // TEMPORARY FIX: Use existing method and manually sort
        List<DonorAssessment> donorAssessments = donorAssessmentRepository.findByPatientPhn(phn);
        if (!donorAssessments.isEmpty()) {
            // Manually sort by ID descending and get the latest
            donorAssessments.sort((a1, a2) -> Long.compare(a2.getId(), a1.getId()));
            profile.setDonor(donorAssessments.get(0));
        }

        return profile;
    }
}