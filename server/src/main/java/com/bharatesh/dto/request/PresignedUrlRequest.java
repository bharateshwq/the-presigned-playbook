package com.bharatesh.dto.request;

import java.util.UUID;

import com.bharatesh.entity.SectionTypes;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PresignedUrlRequest {
    private UUID userId;
    private SectionTypes sectionType;
    private int uploadCount;
}
