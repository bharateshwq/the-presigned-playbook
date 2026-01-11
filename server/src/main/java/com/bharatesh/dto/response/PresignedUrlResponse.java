package com.bharatesh.dto.response;

import java.util.List;

import com.bharatesh.entity.PresignedUrlEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PresignedUrlResponse {

    private List<PresignedUrlEntity> mediaIntents;

}
