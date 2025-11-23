package com.peradeniya.renal.mapper;

import com.peradeniya.renal.dto.PatientCreateRequest;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.model.Admission;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.Period;

@Component
public class PatientMapper {

    public Patient toEntity(PatientCreateRequest request) {
        return toPatient(request); // Alias for toPatient method
    }

    public Patient toPatient(PatientCreateRequest request) {
        if (request == null) {
            return null;
        }

        Patient patient = new Patient();
        patient.setPhn(request.getPhn());
        patient.setName(request.getName());
        patient.setDateOfBirth(request.getDateOfBirth());
        // Calculate age from dateOfBirth when available and set it on the entity
        LocalDate dob = request.getDateOfBirth();
        if (dob != null) {
            try {
                int years = Period.between(dob, LocalDate.now()).getYears();
                patient.setAge(years);
            } catch (Exception e) {
                // fallback: do not set age if calculation fails
            }
        }
        patient.setGender(request.getGender());
        
        // Patient demographics
        patient.setAddress(request.getAddress());
        patient.setContactDetails(request.getContactDetails());
        patient.setNicNo(request.getNicNo());
        patient.setMohArea(request.getMohArea());
        patient.setEthnicGroup(request.getEthnicGroup());
        patient.setReligion(request.getReligion());
        patient.setOccupation(request.getOccupation());
        patient.setMaritalStatus(request.getMaritalStatus());
        
        // Set initial status
        patient.setStatus("Admitted");

        return patient;
    }

    // If you need an admission mapper method
    public Admission toAdmission(PatientCreateRequest request, Patient patient) {
        if (request == null || patient == null) {
            return null;
        }

        Admission admission = new Admission();
        admission.setPatient(patient);
        admission.setWard(request.getWard());
        admission.setWardNumber(request.getWardNumber());
        admission.setBedId(request.getBedId());
        admission.setAdmittedOn(request.getAdmissionDate());
        admission.setAdmissionType(request.getAdmissionType());
        admission.setConsultantName(request.getConsultantName());
        admission.setReferredBy(request.getReferredBy());
        admission.setPrimaryDiagnosis(request.getPrimaryDiagnosis());
        admission.setAdmittingOfficer(request.getAdmittingOfficer());
        admission.setPresentingComplaints(request.getPresentingComplaints());
        admission.setActive(true);

        return admission;
    }
}