package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.FollowUpDTO;
import com.peradeniya.renal.services.FollowUpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/followup")
public class FollowUpController {

    @Autowired
    private FollowUpService service;

    @PostMapping("/{patientPhn}")
    public ResponseEntity<FollowUpDTO> create(@PathVariable String patientPhn, @RequestBody FollowUpDTO dto) {
        try {
            FollowUpDTO saved = service.create(patientPhn, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{patientPhn}")
    public ResponseEntity<List<FollowUpDTO>> getByPatient(@PathVariable String patientPhn) {
        try {
            List<FollowUpDTO> list = service.getByPatientPhn(patientPhn);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
