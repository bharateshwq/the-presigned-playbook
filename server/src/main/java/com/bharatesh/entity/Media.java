package com.bharatesh.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "media", indexes = {
                @Index(name = "idx_media_user", columnList = "user_id"),
                @Index(name = "idx_media_session", columnList = "upload_session_id"),
                @Index(name = "idx_media_section", columnList = "upload_section_id"),
                @Index(name = "idx_media_status", columnList = "upload_status")
})

@Getter
@Setter
public class Media {
        @Id
        private UUID id;

        @ManyToOne(optional = false, fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @ManyToOne(optional = false, fetch = FetchType.LAZY)
        @JoinColumn(name = "upload_session_id", nullable = false)
        private UploadSession uploadSession;

        @ManyToOne(optional = false, fetch = FetchType.LAZY)
        @JoinColumn(name = "upload_section_id", nullable = false)
        private UploadSection uploadSection;

        @Column(name = "cloud_path", nullable = false)
        private String cloudPath;

        @Column(name = "media_type", nullable = false)
        private String type;

        @Enumerated(EnumType.STRING)
        @Column(name = "upload_status", nullable = false)
        private CloudMediaUploadStatus status = CloudMediaUploadStatus.INTENDED;

        @Column(name = "created_at", nullable = false)
        private LocalDateTime createdAt = LocalDateTime.now();

        @Column(name = "updated_at")
        private LocalDateTime updatedAt;

        @PrePersist
        public void prePersist() {
                createdAt = LocalDateTime.now();
                updatedAt = LocalDateTime.now();
        }

        @PreUpdate
        public void preUpdate() {
                updatedAt = LocalDateTime.now();
        }

}
