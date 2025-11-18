package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.ProgressNote;
import com.peradeniya.renal.model.WardAdmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressNoteRepository extends JpaRepository<ProgressNote, Long> {
    List<ProgressNote> findByAdmission(WardAdmission admission);
}
