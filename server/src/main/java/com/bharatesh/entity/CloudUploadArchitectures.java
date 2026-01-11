package com.bharatesh.entity;

public enum CloudUploadArchitectures {
    DB_FIRST_EVENTBRIDGE,
    UPLOAD_FIRST_DB,
    SERVER_SIDE_UPLOAD,
    TWO_PHASE_COMMIT,
    IDEMPOTENT_RETRY,
    CLIENT_ACK
}
