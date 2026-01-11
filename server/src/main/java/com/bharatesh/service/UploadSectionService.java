package com.bharatesh.service;

import com.bharatesh.entity.CloudMediaUploadStatus;
import com.bharatesh.entity.SectionTypes;
import com.bharatesh.entity.UploadSection;
import com.bharatesh.entity.UploadSession;
import com.bharatesh.repository.MediaRepository;
import com.bharatesh.repository.UploadSectionRepository;
import jakarta.transaction.Transactional;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UploadSectionService {
    @Autowired
    private UploadSectionRepository uploadSectionRepository;

    @Autowired
    MediaRepository mediaRepository;

    @Transactional
    public UploadSection createUploadSection(
            UploadSession uploadSession,
            SectionTypes type,
            int maxItems) {
        if (uploadSession == null) {
            throw new IllegalArgumentException("UploadSession must not be null");
        }
        if (type == null) {
            throw new IllegalArgumentException("Section type must not be null");
        }
        if (maxItems <= 0) {
            throw new IllegalArgumentException("maxItems must be greater than zero");
        }

        UploadSection section = new UploadSection();
        section.setUploadSession(uploadSession);
        section.setType(type);
        section.setMaxItems(maxItems);

        return uploadSectionRepository.save(section);
    }

    public UploadSection getMediaUploadSection(UUID uploadSessionId, SectionTypes sectionType) {
        return uploadSectionRepository
                .findByUploadSessionIdAndType(uploadSessionId, sectionType)
                .orElseThrow(() -> new IllegalStateException(
                        "UploadSection not found for uploadSessionId=" + uploadSessionId
                                + " and sectionType=" + sectionType));

    }

    public long getRemainingUploadCapacity(
            UploadSection uploadSection) {

        long alreadyUploadedCount = mediaRepository.countByUploadSectionIdAndStatus(
                uploadSection.getId(),
                CloudMediaUploadStatus.UPLOADED);

        long maxAllowed = uploadSection.getMaxItems();

        long remaining = maxAllowed - alreadyUploadedCount;

        // Never return a negative number
        return Math.max(remaining, 0);
    }

}
