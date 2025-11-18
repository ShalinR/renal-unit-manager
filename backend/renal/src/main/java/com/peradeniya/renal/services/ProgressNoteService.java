package com.peradeniya.renal.services;

import com.peradeniya.renal.model.ProgressNote;
import com.peradeniya.renal.model.WardAdmission;
import com.peradeniya.renal.repository.ProgressNoteRepository;
import com.peradeniya.renal.repository.WardAdmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressNoteService {

    private final ProgressNoteRepository progressNoteRepository;
    private final WardAdmissionRepository wardAdmissionRepository;

    public ProgressNote addProgressNote(Long admissionId, String content) {
        WardAdmission admission = wardAdmissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found"));

        ProgressNote note = ProgressNote.builder()
                .admission(admission)
                .content(content)
                .date(LocalDate.now())
                .time(LocalTime.now())
                .build();

        return progressNoteRepository.save(note);
    }

    public List<ProgressNote> getProgressNotes(Long admissionId) {
        WardAdmission admission = wardAdmissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found"));

        return progressNoteRepository.findByAdmission(admission);
    }
}
