package com.peradeniya.renal.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientBasicDTO {
    private Long id;
    private String phn;
    private String name;
    private Integer age;
    private String gender;
    private LocalDate dateOfBirth;
    private String occupation;
    private String address;
    private String nicNo;
    private String contactDetails;
    private String emailAddress;
}