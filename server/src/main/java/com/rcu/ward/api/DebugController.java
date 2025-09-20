package com.rcu.ward.api;

import com.rcu.ward.model.Admission;
import com.rcu.ward.repo.AdmissionRepository;
import com.rcu.ward.repo.DoctorNoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ward/debug")
@RequiredArgsConstructor
public class DebugController {

  private final AdmissionRepository admissionRepo;
  private final DoctorNoteRepository noteRepo;

  @GetMapping("/seed-check")
  public Map<String, Object> seedCheck() {
    Map<String, Object> out = new LinkedHashMap<>();
    out.put("admissions", admissionRepo.count());
    out.put("bhts", admissionRepo.findAll().stream().map(Admission::getBht).sorted().toList());
    out.put("doctorNotes", noteRepo.count());
    return out;
  }
}