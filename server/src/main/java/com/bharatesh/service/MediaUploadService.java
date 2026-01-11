package com.bharatesh.service;

import com.bharatesh.config.AwsProperties;
import com.bharatesh.dto.response.MediaItemResponse;
import com.bharatesh.dto.response.MediaWithMetadata;
import com.bharatesh.entity.CloudMediaUploadStatus;
import com.bharatesh.entity.CloudUploadArchitectures;
import com.bharatesh.entity.Media;
import com.bharatesh.entity.PresignedUrlEntity;
import com.bharatesh.entity.SectionTypes;
import com.bharatesh.entity.UploadSection;
import com.bharatesh.entity.UploadSession;
import com.bharatesh.entity.User;
import com.bharatesh.exception.UploadLimitExceededException;
import com.bharatesh.repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class MediaUploadService {

        @Autowired
        private S3Client s3Client;

        @Autowired
        private S3Presigner presigner;

        @Autowired
        private MediaRepository mediaRepository;

        @Autowired
        private UserService userService;

        @Autowired
        private UploadSessionService uploadSessionService;

        @Autowired
        private UploadSectionService uploadSectionService;

        private String bucketName;

        public MediaUploadService(
                        AwsProperties awsProperties) {
                this.bucketName = awsProperties.getBucket().getName();
        }

        private List<Media> createMediaRecords(
                        String s3Path,
                        User user,
                        UploadSession session,
                        UploadSection section,
                        int count) {
                List<Media> mediaList = new ArrayList<>();

                for (int i = 0; i < count; i++) {
                        UUID id = UUID.randomUUID();
                        Media media = new Media();

                        media.setId(id);
                        media.setUser(user);
                        media.setUploadSession(session);
                        media.setUploadSection(section);
                        media.setType("type");
                        media.setStatus(CloudMediaUploadStatus.INTENDED);
                        media.setCreatedAt(LocalDateTime.now());
                        media.setUpdatedAt(LocalDateTime.now());
                        media.setCloudPath(s3Path + "/" + id);

                        mediaList.add(media);
                }

                return mediaRepository.saveAll(mediaList);
        }

        private List<PresignedUrlEntity> generatePresignedUrls(String bucketName, String keyName,
                        List<Media> medias) {

                List<PresignedUrlEntity> presignedEntities = medias.stream().map((m) -> {
                        PutObjectRequest objectRequest = PutObjectRequest.builder().bucket(bucketName)
                                        .key(keyName + "/" + m.getId().toString())
                                        .metadata(Map.of("mediaId", m.getId().toString()))
                                        .build();

                        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                                        .signatureDuration(Duration.ofMinutes(10)).putObjectRequest(objectRequest)
                                        .build();

                        PresignedPutObjectRequest presignedRequest = presigner.presignPutObject(presignRequest);
                        // String myUrl = presignedRequest.url().toString();

                        PresignedUrlEntity entity = new PresignedUrlEntity();
                        entity.setMediaId(m.getId());
                        entity.setPresignedUrl(presignedRequest.url().toExternalForm());
                        return entity;
                }).toList();

                return presignedEntities;

        }

        @Transactional
        public List<PresignedUrlEntity> getValidPresignedUrlEntities(UUID userId, CloudUploadArchitectures architecture,
                        SectionTypes sectionType, int requestedUploadCount) {
                User user = userService
                                .getUserById(userId);

                String keyName = userId + "/" + architecture + "/"
                                + sectionType;

                UploadSession uploadSession = uploadSessionService
                                .getMediaUploadSession(userId,
                                                architecture);

                UploadSection uploadSection = uploadSectionService
                                .getMediaUploadSection(uploadSession.getId(), sectionType);

                long remaining = uploadSectionService
                                .getRemainingUploadCapacity(uploadSection);
                if (remaining < requestedUploadCount) {
                        throw new UploadLimitExceededException(
                                        String.format(
                                                        "Upload limit exceeded. Allowed: %d, Requested: %d",
                                                        remaining,
                                                        requestedUploadCount));
                }

                List<Media> mediaRecords = createMediaRecords(keyName, user, uploadSession, uploadSection,
                                requestedUploadCount);

                return generatePresignedUrls(bucketName, keyName, mediaRecords);
        }

        public MediaWithMetadata getMedia(UUID userId, CloudUploadArchitectures architecture,
                        SectionTypes sectionType, List<CloudMediaUploadStatus> uploadStatus) {

                UploadSession uploadSession = uploadSessionService
                                .getMediaUploadSession(userId,
                                                architecture);

                UploadSection uploadSection = uploadSectionService
                                .getMediaUploadSection(uploadSession.getId(), sectionType);

                List<Media> mediaList = mediaRepository.findByUploadSectionIdAndStatusIn(uploadSection.getId(),
                                uploadStatus);
                List<MediaItemResponse> mediaItemList = mediaList.stream()
                                .map((m) -> new MediaItemResponse(m))
                                .toList();

                MediaWithMetadata mediaWithMetadata = MediaWithMetadata.builder()
                                .media(mediaItemList)
                                .metadata(new MediaWithMetadata.Metadata(uploadSection.getId(), uploadSection.getId()))
                                .build();

                return mediaWithMetadata;

        }

        // public UUID deleteMedia(UUID mediaId){

        // }

}
