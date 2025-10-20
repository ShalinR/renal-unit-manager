package com.peradeniya.renal.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true)
	private String phn; // Personal Health Number

	private String name;
	private Integer age;
	private String gender;
	private LocalDate dateOfBirth;
	private String occupation;
	private String address;
	private String nicNo;
	private String contactDetails;
	private String emailAddress;

	public String getContactDetails() {
		return contactDetails;
	}

	public void setContactDetails(String contactDetails) {
		this.contactDetails = contactDetails;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPhn() {
		return phn;
	}

	public void setPhn(String phn) {
		this.phn = phn;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getOccupation() {
		return occupation;
	}

	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getNicNo() {
		return nicNo;
	}

	public void setNicNo(String nicNo) {
		this.nicNo = nicNo;
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public List<DonorAssessment> getDonorAssessments() {
		return donorAssessments;
	}

	public void setDonorAssessments(List<DonorAssessment> donorAssessments) {
		this.donorAssessments = donorAssessments;
	}

	public List<RecipientAssessment> getRecipientAssessments() {
		return recipientAssessments;
	}

	public void setRecipientAssessments(List<RecipientAssessment> recipientAssessments) {
		this.recipientAssessments = recipientAssessments;
	}


	@OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<RecipientAssessment> recipientAssessments = new ArrayList<>();

	@OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<DonorAssessment> donorAssessments = new ArrayList<>();

}
