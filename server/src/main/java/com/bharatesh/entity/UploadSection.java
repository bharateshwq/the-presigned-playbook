package com.bharatesh.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "upload_sections")
@Getter
@Setter
public class UploadSection {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "upload_session_id", nullable = false)
    UploadSession uploadSession;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    SectionTypes type;

    @Column(nullable = false)
    private int maxItems;

    @OneToMany(mappedBy = "uploadSection", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Media> media = new ArrayList<>();

    @Transient
    public int getUploadedCount() {
        return media.size();
    }

}
