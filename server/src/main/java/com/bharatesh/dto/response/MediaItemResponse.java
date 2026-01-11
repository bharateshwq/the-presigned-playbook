package com.bharatesh.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.bharatesh.entity.CloudMediaUploadStatus;
import com.bharatesh.entity.Media;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MediaItemResponse {

    public MediaItemResponse(Media m) {
        this.id = m.getId();
        this.cloudPath = m.getCloudPath();
        this.uploadStatus = m.getStatus();
        this.updatedAt = m.getUpdatedAt();
    }

    private UUID id;
    private String cloudPath;
    private CloudMediaUploadStatus uploadStatus;
    private LocalDateTime updatedAt;
}
