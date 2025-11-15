package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.FeedbackDTO;
import com.peradeniya.renal.model.Feedback;
import com.peradeniya.renal.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository repository;

    public FeedbackDTO create(FeedbackDTO dto) {
        Feedback feedback = Feedback.builder()
                .submittedBy(dto.getSubmittedBy())
                .submittedByName(dto.getSubmittedByName())
                .role(dto.getRole())
                .message(dto.getMessage())
                .status("PENDING")
                .build();

        Feedback saved = repository.save(feedback);
        return convertToDTO(saved);
    }

    public List<FeedbackDTO> getAll() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getByStatus(String status) {
        return repository.findByStatusOrderByCreatedAtDesc(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FeedbackDTO updateStatus(Long id, String status) {
        Feedback feedback = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));
        
        feedback.setStatus(status);
        Feedback saved = repository.save(feedback);
        return convertToDTO(saved);
    }

    private FeedbackDTO convertToDTO(Feedback feedback) {
        return FeedbackDTO.builder()
                .id(feedback.getId())
                .submittedBy(feedback.getSubmittedBy())
                .submittedByName(feedback.getSubmittedByName())
                .role(feedback.getRole())
                .message(feedback.getMessage())
                .status(feedback.getStatus())
                .createdAt(feedback.getCreatedAt())
                .updatedAt(feedback.getUpdatedAt())
                .build();
    }
}

