package com.peradeniya.renal.repository;

import com.peradeniya.renal.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByStatusOrderByCreatedAtDesc(String status);
    
    List<Feedback> findAllByOrderByCreatedAtDesc();
    
    @Query("SELECT f FROM Feedback f WHERE f.submittedBy = :username ORDER BY f.createdAt DESC")
    List<Feedback> findBySubmittedByOrderByCreatedAtDesc(String username);
}

