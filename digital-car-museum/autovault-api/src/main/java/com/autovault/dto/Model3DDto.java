package com.autovault.dto;

import java.time.LocalDateTime;

public record Model3DDto(
        Long id,
        String fileName,
        Long fileSizeBytes,
        String format,
        Integer polyCount,
        Boolean hasAnimations,
        String defaultColor,
        String source,
        String license,
        String attribution,
        Long carId,
        LocalDateTime uploadedAt
) {}
