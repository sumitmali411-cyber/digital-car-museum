package com.autovault.dto;

import java.math.BigDecimal;
import java.util.List;

public record CarDto(
        Long id,
        String modelName,
        String slug,
        Integer year,
        String generation,
        String bodyType,
        String engineType,
        Integer horsepower,
        String torque,
        String transmission,
        String drivetrain,
        String fuelType,
        Integer topSpeedKmh,
        BigDecimal acceleration0100,
        Integer weightKg,
        BigDecimal priceUsd,
        String description,
        String imageUrl,
        List<String> galleryUrls,
        Long manufacturerId,
        String manufacturerName,
        String manufacturerSlug,
        String manufacturerLogoUrl,
        Long countryId,
        String countryName,
        String countryCode,
        boolean has3dModel,
        List<CarColorDto> colors
) {}
