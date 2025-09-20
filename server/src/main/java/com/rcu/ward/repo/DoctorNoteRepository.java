package com.rcu.ward.repo;

import com.rcu.ward.model.DoctorNote;
import com.rcu.ward.model.Admission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorNoteRepository extends JpaRepository<DoctorNote, Long> {
  Page<DoctorNote> findByAdmissionOrderByCreatedAtDesc(Admission admission, Pageable pageable);
}
