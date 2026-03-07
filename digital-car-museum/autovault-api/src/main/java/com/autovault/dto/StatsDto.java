package com.autovault.dto;

public record StatsDto(
        long totalCountries,
        long totalManufacturers,
        long totalCars,
        long carsWith3DModel,
        long totalElectricCars,
        int earliestYear,
        int latestYear
) {}
