package com.bharatesh.repository;

import com.bharatesh.entity.SectionTypes;
import com.bharatesh.entity.UploadSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UploadSectionRepository extends JpaRepository<UploadSection, UUID> {
    List<UploadSection> findByUploadSessionId(UUID sessionId);

    Optional<UploadSection> findByUploadSessionIdAndType(UUID uploadSessionId, SectionTypes sectionType);

}
