package com.peradeniya.renal.dto;

import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Patient;
import lombok.Data;
import java.time.format.DateTimeFormatter;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class PatientResponse {

    private Long id;
    private String phn;
    private String name;
    private LocalDate dateOfBirth;
    private String gender;
    private String status;

    private String address;
    private String contactDetails;
    private String nicNo;
    private String mohArea;
    private String ethnicGroup;
    private String religion;
    private String occupation;
    private String maritalStatus;

    // ⭐ FIX: THE FIELD FRONTEND EXPECTS
    private AdmissionResponse activeAdmission;

    private List<String> medicalProblems;
    private List<String> allergies;

    public static PatientResponse from(Patient p, Admission a) {

        AdmissionResponse admissionDto = null;

        if (a != null) {
            admissionDto = new AdmissionResponse(
                    a.getId(),
                    a.getBhtNumber(),
                    a.getNumber(),
                    a.isActive(),
                    a.isDischargeSummaryAvailable(),

                    a.getAdmittedOn(),
                    a.getAdmissionTime() != null
                            ? a.getAdmissionTime().toString()
                            : null,

                    a.getWard(),
                    a.getWardNumber(),
                    a.getBedId(),

                    a.getConsultantName(),
                    a.getReferredBy(),
                    a.getPrimaryDiagnosis(),
                    a.getAdmissionType(),
                    a.getAdmittingOfficer(),
                    a.getPresentingComplaints(),

                    a.getExamTempC(),
                    a.getExamHeightCm(),
                    a.getExamWeightKg(),
                    a.getExamBMI(),
                    a.getExamBloodPressure(),
                    a.getExamHeartRate()
            );
        }

        PatientResponse response = new PatientResponse();

        response.setId(p.getId());
        response.setPhn(p.getPhn());
        response.setName(p.getName());
        response.setDateOfBirth(p.getDateOfBirth());
        response.setGender(p.getGender());
        response.setStatus(p.getStatus());

        response.setAddress(p.getAddress());
        response.setContactDetails(p.getContactDetails());
        response.setNicNo(p.getNicNo());
        response.setMohArea(p.getMohArea());
        response.setEthnicGroup(p.getEthnicGroup());
        response.setReligion(p.getReligion());
        response.setOccupation(p.getOccupation());
        response.setMaritalStatus(p.getMaritalStatus());

        response.setActiveAdmission(admissionDto);

        response.setMedicalProblems(p.getMedicalHistory().stream().map(mp -> mp.getProblem()).collect(Collectors.toList()));
        response.setAllergies(p.getAllergies().stream().map(allergy -> allergy.getAllergy()).collect(Collectors.toList()));

        return response;
    }
}
