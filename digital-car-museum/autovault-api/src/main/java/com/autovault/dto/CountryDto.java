package com.autovault.dto;

import java.math.BigDecimal;

public record CountryDto(
        Long id,
        String name,
        String code,
        String flagUrl,
        String continent,
        String description,
        BigDecimal mapLat,
        BigDecimal mapLng,
        Integer displayOrder,
        long manufacturerCount
) {}
