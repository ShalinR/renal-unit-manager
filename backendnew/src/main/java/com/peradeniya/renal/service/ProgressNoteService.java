package com.peradeniya.renal.service;

import com.peradeniya.renal.dto.ProgressNoteRequest;
import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.ProgressNote;
import com.peradeniya.renal.repository.ProgressNoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProgressNoteService {

    private final ProgressNoteRepository repo;

    public ProgressNote addNote(Admission admission, ProgressNoteRequest r) {

        ProgressNote n = ProgressNote.builder()
                .admission(admission)
                .createdAt(LocalDateTime.now())
                .tempC(r.getTempC())
                .weightKg(r.getWeightKg())
                .bpHigh(r.getBpHigh())
                .bpLow(r.getBpLow())
                .heartRate(r.getHeartRate())
                .inputMl(r.getInputMl())
                .urineOutputMl(r.getUrineOutputMl())
                .pdBalance(r.getPdBalance())
                .totalBalance(r.getTotalBalance())
                .build();

        return repo.save(n);
    }
}
