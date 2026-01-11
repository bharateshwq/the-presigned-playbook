package com.bharatesh.dto.request;

import java.util.List;
import java.util.UUID;

import com.bharatesh.entity.CloudMediaUploadStatus;
import com.bharatesh.entity.CloudUploadArchitectures;
import com.bharatesh.entity.SectionTypes;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MediaWithMetadataRequest {
    private UUID userId;
    private SectionTypes sectionType;
    private int uploadCount;
    private List<CloudMediaUploadStatus> uploadStatuses;
    private CloudUploadArchitectures architecture;
}
