package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.HemodialysisRecordDto;
import com.peradeniya.renal.services.HemodialysisRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hemodialysis")
@CrossOrigin(origins = "http://localhost:5173")
public class HemodialysisRecordController {

    private final HemodialysisRecordService service;

    @Autowired
    public HemodialysisRecordController(HemodialysisRecordService service) {
        this.service = service;
    }

    @PostMapping("/{patientId}")
    public ResponseEntity<HemodialysisRecordDto> createRecord(
            @PathVariable String patientId,
            @RequestBody HemodialysisRecordDto dto) {
        HemodialysisRecordDto savedRecord = service.createRecord(patientId, dto);
        return ResponseEntity.ok(savedRecord);
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<List<HemodialysisRecordDto>> getRecordsByPatientId(
            @PathVariable String patientId) {
        List<HemodialysisRecordDto> records = service.getRecordsByPatientId(patientId);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/record/{id}")
    public ResponseEntity<HemodialysisRecordDto> getRecordById(@PathVariable Long id) {
        HemodialysisRecordDto record = service.getRecordById(id);
        if (record != null) {
            return ResponseEntity.ok(record);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/record/{id}")
    public ResponseEntity<HemodialysisRecordDto> updateRecord(
            @PathVariable Long id,
            @RequestBody HemodialysisRecordDto dto) {
        HemodialysisRecordDto updatedRecord = service.updateRecord(id, dto);
        return ResponseEntity.ok(updatedRecord);
    }

    @DeleteMapping("/record/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        service.deleteRecord(id);
        return ResponseEntity.ok().build();
    }
}

