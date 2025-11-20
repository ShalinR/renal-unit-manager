package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.HdScheduleAppointmentDto;
import com.peradeniya.renal.model.HdScheduleAppointment;
import com.peradeniya.renal.repository.HdScheduleAppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HdScheduleService {

    private final HdScheduleAppointmentRepository repository;

    public HdScheduleService(HdScheduleAppointmentRepository repository) {
        this.repository = repository;
    }

    public List<HdScheduleAppointmentDto> getByDate(LocalDate date) {
        return repository.findByDate(date)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public HdScheduleAppointmentDto book(HdScheduleAppointmentDto dto) {
        LocalDate date = LocalDate.parse(dto.getDate());
        repository.findByDateAndSlotId(date, dto.getSlotId()).ifPresent(a -> {
            throw new IllegalStateException("Slot already booked");
        });

        HdScheduleAppointment entity = new HdScheduleAppointment();
        entity.setPhn(dto.getPhn());
        entity.setPatientName(dto.getPatientName());
        entity.setDate(date);
        entity.setSlotId(dto.getSlotId());
        entity.setNotes(dto.getNotes());

        HdScheduleAppointment saved = repository.save(entity);
        return toDto(saved);
    }

    public void cancel(Long id) {
        repository.deleteById(id);
    }

    private HdScheduleAppointmentDto toDto(HdScheduleAppointment a) {
        HdScheduleAppointmentDto dto = new HdScheduleAppointmentDto();
        dto.setId(a.getId());
        dto.setPhn(a.getPhn());
        dto.setPatientName(a.getPatientName());
        dto.setDate(a.getDate().toString());
        dto.setSlotId(a.getSlotId());
        dto.setNotes(a.getNotes());
        return dto;
    }
}
