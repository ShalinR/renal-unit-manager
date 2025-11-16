package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "follow_up")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowUp {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String date;

	@Column(columnDefinition = "TEXT")
	private String doctorNote; // Match frontend

	private String sCreatinine;
	private String eGFR;

	@ManyToOne
	@JoinColumn(name = "patient_phn")
	private Patient patient;
}