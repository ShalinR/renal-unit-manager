package com.peradeniya.renal.controller;

import com.peradeniya.renal.model.ProgressNote;
import com.peradeniya.renal.services.ProgressNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ward/progress-notes")
@RequiredArgsConstructor
@CrossOrigin
public class ProgressNoteController {

    private final ProgressNoteService progressNoteService;

    @PostMapping("/{admissionId}")
    public ProgressNote addNote(
            @PathVariable Long admissionId,
            @RequestBody ProgressNote note
    ) {
        return progressNoteService.addNote(admissionId, note);
    }

    @GetMapping("/{admissionId}")
    public List<ProgressNote> getNotes(@PathVariable Long admissionId) {
        return progressNoteService.getNotesByAdmission(admissionId);
    }
}
