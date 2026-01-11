package com.bharatesh.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "cloud.aws")
@Data
public class AwsProperties {

    private Credentials credentials;
    private Region region;
    private Bucket bucket;

    @Data
    public static class Credentials {
        private String accessKey;
        private String secretKey;
    }

    @Data
    public static class Region {
        private String staticRegion;
    }

    @Data
    public static class Bucket {
        private String name;
    }
}
