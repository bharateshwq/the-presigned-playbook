package com.bharatesh.repository;

import com.bharatesh.entity.CloudUploadArchitectures;
import com.bharatesh.entity.UploadSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UploadSessionRepository extends JpaRepository<UploadSession, UUID> {
    List<UploadSession> findByUserId(UUID userId);

    Optional<UploadSession> findByUserIdAndArchitectureType(
            UUID userId,
            CloudUploadArchitectures architectureType);
}
