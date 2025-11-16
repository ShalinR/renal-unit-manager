package com.peradeniya.renal.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompletedBy {
    @Column(length = 100)
    private String staffName;
    @Column(length = 100)
    private String staffRole;
    @Column(length = 50)
    private String staffId;
    @Column(length = 100)
    private String department;
    @Column(length = 100)
    private String signature;

    private LocalDate completionDate;
}