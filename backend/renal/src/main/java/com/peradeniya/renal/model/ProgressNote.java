package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "progress_note")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to admission
    @ManyToOne
    @JoinColumn(name = "admission_id", nullable = false)
    private WardAdmission admission;

    @Column(name = "note_date", nullable = false)
    private LocalDate date;

    @Column(name = "note_time")
    private LocalTime time;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;
}
