package com.rcu.ward.seed;

import com.rcu.ward.model.*;
import com.rcu.ward.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

  private final AdmissionRepository admissionRepo;
  private final PatientRepository patientRepo;
  private final GuardianRepository guardianRepo;
  private final AdmissionClinicalRepository clinicalRepo;
  private final DoctorNoteRepository noteRepo;

  @Override
  @Transactional
  public void run(String... args) {
    List<String> bhts = List.of("RCU-0001","RCU-0002","RCU-0003","RCU-0004","RCU-0005");
    for (String bht : bhts) {
      if (admissionRepo.findByBht(bht).isEmpty()) {
        seedOne(bht);
      }
    }
  }

  private void seedOne(String bht) {
    Patient p = Patient.builder()
        .phn("PHN-" + bht.substring(bht.length()-4))
        .fullName(switch (bht) {
          case "RCU-0001" -> "Kumari Perera";
          case "RCU-0002" -> "Nimal Fernando";
          case "RCU-0003" -> "Tharushi Silva";
          case "RCU-0004" -> "Sahan Jayasuriya";
          default -> "Ruwanthi Dissanayake";
        })
        .address("123 Temple Rd, Kandy")
        .telephone("+94771234567")
        .nic("199012345678")
        .mohArea("Kandy")
        .dateOfBirth(LocalDate.of(1990,5,14))
        .age(35)
        .sex(Sex.FEMALE)
        .ethnicGroup("Sinhala")
        .religion("Buddhist")
        .occupation("Teacher")
        .maritalStatus("Married")
        .build();
    patientRepo.save(p);

    Guardian g = Guardian.builder()
        .name("Pradeep Perera")
        .address("123 Temple Rd, Kandy")
        .telephone("+94770001122")
        .nic("851234567V")
        .build();
    guardianRepo.save(g);

    AdmissionClinical c = AdmissionClinical.builder()
        .typeOfAdmission(TypeOfAdmission.DIRECT_ADMISSION)
        .complaints("Fatigue, ankle swelling.")
        .examination("BP 140/90. Peripheral edema +.")
        .allergies("No known drug allergies.")
        .currentMedications("Losartan 50 mg OD")
        .problems("CKD stage 4")
        .management("Monitor I/O, adjust meds.")
        .stamps("MO")
        .notifiableDisease(false)
        .admittingOfficer("Dr. Senanayake")
        .build();
    clinicalRepo.save(c);

    Admission a = Admission.builder()
        .bht(bht)
        .dateOfAdmission(LocalDate.now())
        .timeOfAdmission(LocalTime.now().withNano(0))
        .wardNumber("W-12")
        .consultantName("Dr. Perera (Nephrology)")
        .patient(p)
        .guardian(g)
        .clinical(c)
        .build();
    admissionRepo.save(a);

    DoctorNote n = DoctorNote.builder()
        .admission(a)
        .authorName("Dr. Perera")
        .text("Initial assessment recorded. Labs pending.")
        .build();
    noteRepo.save(n);
  }
}