package com.bharatesh.service;

import com.bharatesh.entity.CloudUploadArchitectures;
import com.bharatesh.entity.UploadSession;
import com.bharatesh.entity.User;
import com.bharatesh.repository.UploadSessionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UploadSessionService {

    @Autowired
    private UploadSessionRepository uploadSessionRepository;

    @Transactional
    public UploadSession createUploadSession(User user,
            CloudUploadArchitectures architectureType) {
        if (user == null) {
            throw new IllegalArgumentException("User must not be null");
        }
        if (architectureType == null) {
            throw new IllegalArgumentException("Architecture type must not be null");
        }
        UploadSession uploadSession = new UploadSession();
        uploadSession.setUser(user);
        uploadSession.setArchitectureType(architectureType);
        uploadSession.setCreatedAt(LocalDateTime.now());
        uploadSession.setExpiresAt(uploadSession.getCreatedAt().plusHours(1));
        return uploadSessionRepository.save(uploadSession);
    }

    public UploadSession getMediaUploadSession(
            UUID userId,
            CloudUploadArchitectures architectureType) {
        return uploadSessionRepository
                .findByUserIdAndArchitectureType(userId, architectureType)
                .orElseThrow(() -> new IllegalStateException(
                        "UploadSession not found for userId=" + userId +
                                " and architectureType=" + architectureType));
    }

}
