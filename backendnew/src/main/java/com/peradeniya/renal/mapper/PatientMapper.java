package com.peradeniya.renal.mapper;

import com.peradeniya.renal.dto.PatientCreateRequest;
import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Patient;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PatientMapper {

    public Patient toPatient(PatientCreateRequest r) {
        return Patient.builder()
                .phn(r.getPhn())
                .name(r.getName())
                .dob(r.getDob())
                .sex(r.getSex())
                .address(r.getAddress())
                .phone(r.getPhone())
                .nic(r.getNic())
                .mohArea(r.getMohArea())
                .ethnicGroup(r.getEthnicGroup())
                .religion(r.getReligion())
                .occupation(r.getOccupation())
                .maritalStatus(r.getMaritalStatus())
                .status("Admitted")
                .build();
    }

    public Admission toAdmission(PatientCreateRequest r) {
        Admission admission = Admission.builder()
                .ward(r.getWard())
                .wardNumber(r.getWardNumber())
                .bedId(r.getBedId())
                .admittedOn(r.getAdmissionDate())
                .consultantName(r.getConsultantName())
                .referredBy(r.getReferredBy())
                .primaryDiagnosis(r.getPrimaryDiagnosis())
                .admissionType(r.getAdmissionType())
                .admittingOfficer(r.getAdmittingOfficer())
                .presentingComplaints(r.getPresentingComplaints())
                .examTempC(r.getTempC())
                .examHeightCm(r.getHeightCm())
                .examWeightKg(r.getWeightKg())
                .examBMI(r.getBmi())
                .examBloodPressure(r.getBloodPressure())
                .examHeartRate(r.getHeartRate())
                .active(true)
                .dischargeSummaryAvailable(false)
                .build();

        // Handle admission time
        if (r.getAdmissionTime() != null) {
            admission.setAdmissionTime(r.getAdmissionTime());
        } else {
            admission.setAdmissionTime(LocalDateTime.now());
        }

        return admission;
    }
}