package com.bharatesh.controller;

import com.bharatesh.config.AwsProperties;
import com.bharatesh.dto.request.MediaWithMetadataRequest;
import com.bharatesh.dto.request.PresignedUrlRequest;
import com.bharatesh.dto.response.MediaWithMetadata;
import com.bharatesh.dto.response.PresignedUrlResponse;
import com.bharatesh.entity.CloudMediaUploadStatus;
import com.bharatesh.entity.CloudUploadArchitectures;
import com.bharatesh.entity.PresignedUrlEntity;
import com.bharatesh.service.MediaUploadService;

import jakarta.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/media")
public class MediaUpload {

        @Autowired
        private MediaUploadService mediaUploadService;

        private final AwsProperties awsProperties;

        public MediaUpload(
                        AwsProperties awsProperties) {
                this.awsProperties = awsProperties;
        }

        @PostMapping("/db-first-eventbridge")
        public ResponseEntity<PresignedUrlResponse> getMediaUploadUrl(
                        @RequestBody PresignedUrlRequest request) {
                List<PresignedUrlEntity> presignedUrlEntities = mediaUploadService
                                .getValidPresignedUrlEntities(
                                                request.getUserId(),
                                                CloudUploadArchitectures.DB_FIRST_EVENTBRIDGE,
                                                request.getSectionType(),
                                                request.getUploadCount());

                PresignedUrlResponse mediaIntents = new PresignedUrlResponse(presignedUrlEntities);
                return ResponseEntity.ok(mediaIntents);
        }

        // @DeleteMapping("/{mediaId}")
        // public ResponseEntity<PresignedUrlResponse> deleteMedia(
        // @PathVariable("mediaId") UUID mediaId) {

        // }

        @GetMapping("/db-first-eventbridge")
        public ResponseEntity<MediaWithMetadata> getMedia(
                        @RequestBody MediaWithMetadataRequest request) {
                MediaWithMetadata mediaWithMetadata = mediaUploadService
                                .getMedia(request.getUserId(), request.getArchitecture(), request.getSectionType(),
                                                request.getUploadStatuses());
                return ResponseEntity.ok(mediaWithMetadata);
        }
}
