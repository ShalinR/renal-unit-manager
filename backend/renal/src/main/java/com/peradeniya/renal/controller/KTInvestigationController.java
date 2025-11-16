package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.KTInvestigationDTO;
import com.peradeniya.renal.services.KTInvestigationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transplant")
public class KTInvestigationController {

    @Autowired
    private KTInvestigationService service;

    @PostMapping("/kt-investigation/{patientPhn}")
    public ResponseEntity<KTInvestigationDTO> create(@PathVariable String patientPhn, @RequestBody KTInvestigationDTO dto) {
        try {
            KTInvestigationDTO saved = service.create(patientPhn, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/kt-investigation/{patientPhn}")
    public ResponseEntity<List<KTInvestigationDTO>> getByPatient(@PathVariable String patientPhn) {
        try {
            List<KTInvestigationDTO> list = service.getByPatientPhn(patientPhn);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/kt-investigation/id/{id}")
    public ResponseEntity<KTInvestigationDTO> getById(@PathVariable Long id) {
        try {
            return service.getById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/kt-investigation/{id}")
    public ResponseEntity<KTInvestigationDTO> update(@PathVariable Long id, @RequestBody KTInvestigationDTO dto) {
        try {
            KTInvestigationDTO updated = service.update(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/kt-investigation/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
