package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.HdScheduleAppointmentDto;
import com.peradeniya.renal.services.HdScheduleService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/hd-schedule")
public class HdScheduleController {

    private final HdScheduleService service;

    public HdScheduleController(HdScheduleService service) {
        this.service = service;
    }

    @GetMapping("/day")
    public ResponseEntity<List<HdScheduleAppointmentDto>> getDay(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(service.getByDate(date));
    }

    @PostMapping("/book")
    public ResponseEntity<HdScheduleAppointmentDto> book(@RequestBody HdScheduleAppointmentDto dto) {
        return ResponseEntity.ok(service.book(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        service.cancel(id);
        return ResponseEntity.noContent().build();
    }
}
