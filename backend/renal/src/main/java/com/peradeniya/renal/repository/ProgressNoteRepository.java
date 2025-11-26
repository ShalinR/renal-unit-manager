package com.peradeniya.renal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.peradeniya.renal.model.ProgressNote;

public interface ProgressNoteRepository extends JpaRepository<ProgressNote, Long> {
    List<ProgressNote> findByAdmissionIdOrderByCreatedAtDesc(Long admissionId);
}
