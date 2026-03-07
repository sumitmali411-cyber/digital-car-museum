package com.autovault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record CarRequest(
        @NotBlank String modelName,
        @NotNull Integer year,
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
        @NotNull Long manufacturerId,
        List<CarColorDto> colors
) {}
