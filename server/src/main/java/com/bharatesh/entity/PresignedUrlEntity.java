package com.bharatesh.entity;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PresignedUrlEntity {
    private String presignedUrl;
    private UUID mediaId;
}
