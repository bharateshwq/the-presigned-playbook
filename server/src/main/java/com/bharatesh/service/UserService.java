package com.bharatesh.service;

import com.bharatesh.entity.*;
import com.bharatesh.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UploadSectionService uploadSectionService;

    @Autowired
    private UploadSessionService uploadSessionService;

    @Transactional
    public User createUserOrchestrated(String name) {
        User user = createGenericUser(name);
        for (CloudUploadArchitectures architecture : CloudUploadArchitectures.values()) {

            UploadSession uploadSession = uploadSessionService.createUploadSession(user, architecture);

            // maintain bidirectional relationship
            user.getUploadSessions().add(uploadSession);

            for (SectionTypes sectionType : SectionTypes.values()) {

                UploadSection uploadSection = uploadSectionService.createUploadSection(
                        uploadSession,
                        sectionType,
                        defaultMaxItems(sectionType));

                // maintain bidirectional relationship
                uploadSession.getUploadSections().add(uploadSection);
            }
        }

        return user;

    }

    private int defaultMaxItems(SectionTypes type) {
        return switch (type) {
            case SINGLE -> 1;
            case MULTIPLE -> 3;
            case MULTIPART -> 1;
        };
    }

    @Transactional
    public User createGenericUser(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("User name must not be null or blank");
        }
        String processedName = name.trim();
        if (userRepository.existsByName(processedName)) {
            throw new IllegalStateException("User already exists with name: " + name);
        }
        User newUser = new User(processedName, LocalDateTime.now());
        return userRepository.save(newUser);
    }

    @Transactional
    public void deleteUser(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("User not found");
        }
        userRepository.deleteById(userId);
    }

    public User getUserById(UUID userId) {

        return userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

}