package com.rcu.ward.api;

import com.rcu.ward.dto.*;
import com.rcu.ward.service.WardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ward")
@RequiredArgsConstructor
@CrossOrigin // allow frontend during demo
public class WardController {

  private final WardService wardService;

  @GetMapping("/admissions/{bht}")
  public AdmissionDTO getAdmission(@PathVariable String bht) {
    return wardService.getAdmissionByBht(bht);
  }

  @GetMapping("/admissions/{bht}/notes")
  public List<DoctorNoteDTO> listNotes(
      @PathVariable String bht,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size
  ) {
    return wardService.listDoctorNotes(bht, page, size);
  }

  @PostMapping("/admissions/{bht}/notes")
  public DoctorNoteDTO createNote(
      @PathVariable String bht,
      @Valid @RequestBody CreateDoctorNoteRequest request
  ) {
    return wardService.addDoctorNote(bht, request);
  }
}