package com.rcu.ward.service;

import com.rcu.ward.dto.*;
import com.rcu.ward.model.*;
import com.rcu.ward.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WardService {

  private final AdmissionRepository admissionRepo;
  private final DoctorNoteRepository noteRepo;

  // ---- Queries ----
  @Transactional(readOnly = true)
  public AdmissionDTO getAdmissionByBht(String bht) {
    if (bht == null || bht.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "BHT is required");
    }
    Admission admission = admissionRepo.findByBht(bht)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No admission for BHT " + bht));
    return toAdmissionDTO(admission);
  }

  @Transactional(readOnly = true)
  public List<DoctorNoteDTO> listDoctorNotes(String bht, int page, int size) {
    Admission admission = admissionRepo.findByBht(bht)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No admission for BHT " + bht));

    Page<DoctorNote> notes = noteRepo.findByAdmissionOrderByCreatedAtDesc(admission, PageRequest.of(page, size));
    return notes.getContent().stream().map(this::toDoctorNoteDTO).toList();
  }

  // ---- Commands ----
  @Transactional
  public DoctorNoteDTO addDoctorNote(String bht, CreateDoctorNoteRequest request) {
    if (request == null || request.getText() == null || request.getText().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Note text is required");
    }
    Admission admission = admissionRepo.findByBht(bht)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No admission for BHT " + bht));

    DoctorNote note = DoctorNote.builder()
        .admission(admission)
        .authorName(request.getAuthorName())
        .text(request.getText())
        .build();

    DoctorNote saved = noteRepo.save(note);
    return toDoctorNoteDTO(saved);
  }

  // ---- Mappers ----
  private AdmissionDTO toAdmissionDTO(Admission a) {
    return AdmissionDTO.builder()
        .bht(a.getBht())
        .dateOfAdmission(a.getDateOfAdmission())
        .timeOfAdmission(a.getTimeOfAdmission())
        .wardNumber(a.getWardNumber())
        .consultantName(a.getConsultantName())
        .patient(toPatientDTO(a.getPatient()))
        .guardian(toGuardianDTO(a.getGuardian()))
        .clinical(toAdmissionClinicalDTO(a.getClinical()))
        .build();
  }

  private PatientDTO toPatientDTO(Patient p) {
    if (p == null) return null;
    return PatientDTO.builder()
        .phn(p.getPhn())
        .fullName(p.getFullName())
        .address(p.getAddress())
        .telephone(p.getTelephone())
        .nic(p.getNic())
        .mohArea(p.getMohArea())
        .dateOfBirth(p.getDateOfBirth())
        .age(p.getAge())
        .sex(p.getSex())
        .ethnicGroup(p.getEthnicGroup())
        .religion(p.getReligion())
        .occupation(p.getOccupation())
        .maritalStatus(p.getMaritalStatus())
        .build();
  }

  private GuardianDTO toGuardianDTO(Guardian g) {
    if (g == null) return null;
    return GuardianDTO.builder()
        .name(g.getName())
        .address(g.getAddress())
        .telephone(g.getTelephone())
        .nic(g.getNic())
        .build();
  }

  private AdmissionClinicalDTO toAdmissionClinicalDTO(AdmissionClinical c) {
    if (c == null) return null;
    return AdmissionClinicalDTO.builder()
        .typeOfAdmission(c.getTypeOfAdmission())
        .complaints(c.getComplaints())
        .examination(c.getExamination())
        .allergies(c.getAllergies())
        .currentMedications(c.getCurrentMedications())
        .problems(c.getProblems())
        .management(c.getManagement())
        .stamps(c.getStamps())
        .notifiableDisease(c.isNotifiableDisease())
        .admittingOfficer(c.getAdmittingOfficer())
        .build();
  }

  private DoctorNoteDTO toDoctorNoteDTO(DoctorNote n) {
    return DoctorNoteDTO.builder()
        .id(n.getId())
        .authorName(n.getAuthorName())
        .text(n.getText())
        .createdAt(n.getCreatedAt())
        .build();
  }
}