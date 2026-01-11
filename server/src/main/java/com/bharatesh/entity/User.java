package com.bharatesh.entity;


import jakarta.persistence.*;
import lombok.*;
import org.jspecify.annotations.NonNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
        name = "users",
        indexes = {
                @Index(name = "idx_users_name", columnList = "name", unique = true)
        }
)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@RequiredArgsConstructor
public class User {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    private UUID id;

    @NonNull
    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    @NonNull
    private LocalDateTime createdAt;

    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private List<UploadSession> uploadSessions = new ArrayList<>();

}
