package com.bharatesh.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "upload_sessions")
@Getter
@Setter
public class UploadSession {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CloudUploadArchitectures architectureType;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime expiresAt;

    @OneToMany(
            mappedBy = "uploadSession",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<UploadSection> uploadSections = new ArrayList<>();
}
