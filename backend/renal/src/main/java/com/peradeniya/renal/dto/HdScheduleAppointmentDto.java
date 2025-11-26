package com.peradeniya.renal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HdScheduleAppointmentDto {
    private Long id;
    private String phn;
    private String patientName;
    private String date; // yyyy-MM-dd
    private String slotId;
    private String notes;
}
