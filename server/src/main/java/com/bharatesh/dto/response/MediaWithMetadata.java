package com.bharatesh.dto.response;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class MediaWithMetadata {

    List<MediaItemResponse> media;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Metadata {
        UUID uploadSectionId;
        UUID uploadSessionId;
    }

    Metadata metadata;
}
