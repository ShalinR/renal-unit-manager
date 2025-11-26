package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.HdScheduleAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HdScheduleAppointmentRepository extends JpaRepository<HdScheduleAppointment, Long> {
    List<HdScheduleAppointment> findByDate(LocalDate date);
    Optional<HdScheduleAppointment> findByDateAndSlotId(LocalDate date, String slotId);
}
