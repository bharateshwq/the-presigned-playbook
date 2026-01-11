package com.bharatesh.advice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.bharatesh.exception.ApiError;
import com.bharatesh.exception.UploadLimitExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UploadLimitExceededException.class)
    public ResponseEntity<ApiError> handleUploadLimitExceeded(
            UploadLimitExceededException ex) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ApiError(ex.getMessage()));
    }
}
