package com.autovault.dto;

public record ManufacturerDto(
        Long id,
        String name,
        String slug,
        Integer foundedYear,
        String founderName,
        String headquarters,
        String logoUrl,
        String history,
        String description,
        String websiteUrl,
        Long countryId,
        String countryName,
        String countryCode,
        long carCount
) {}
