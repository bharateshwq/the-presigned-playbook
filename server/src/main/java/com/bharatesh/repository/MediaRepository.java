package com.bharatesh.repository;

import com.bharatesh.entity.CloudMediaUploadStatus;
import com.bharatesh.entity.Media;
import com.bharatesh.entity.UploadSection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface MediaRepository extends JpaRepository<Media, UUID> {
        List<Media> findByStatus(CloudMediaUploadStatus status);

        List<Media> findByUserIdAndUploadSessionId(UUID userId, UUID sessionId);

        List<Media> findByUploadSectionIdAndStatus(
                        UUID sectionId,
                        CloudMediaUploadStatus status);

        long countByUploadSectionIdAndStatus(
                        UUID sectionId,
                        CloudMediaUploadStatus status);

        List<Media> findByUploadSectionIdAndStatusIn(
                        UUID uploadSectionId,
                        Collection<CloudMediaUploadStatus> statuses);

}
