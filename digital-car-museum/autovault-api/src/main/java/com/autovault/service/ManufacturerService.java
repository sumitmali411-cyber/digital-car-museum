package com.autovault.service;

import com.autovault.dto.ManufacturerDto;
import com.autovault.entity.Country;
import com.autovault.entity.Manufacturer;
import com.autovault.exception.ResourceNotFoundException;
import com.autovault.repository.CarRepository;
import com.autovault.repository.CountryRepository;
import com.autovault.repository.ManufacturerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ManufacturerService {

    private final ManufacturerRepository manufacturerRepository;
    private final CountryRepository countryRepository;
    private final CarRepository carRepository;

    public List<ManufacturerDto> findAll() {
        return manufacturerRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<ManufacturerDto> findByCountry(Long countryId) {
        return manufacturerRepository.findByCountryIdAndActiveTrueOrderByNameAsc(countryId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public ManufacturerDto findById(Long id) {
        Manufacturer m = manufacturerRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Manufacturer", id));
        return toDto(m);
    }

    public ManufacturerDto findBySlug(String slug) {
        Manufacturer m = manufacturerRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Manufacturer not found: " + slug));
        return toDto(m);
    }

    @Transactional
    public ManufacturerDto create(Manufacturer manufacturer) {
        if (manufacturerRepository.existsBySlug(manufacturer.getSlug())) {
            throw new IllegalArgumentException("Slug already exists: " + manufacturer.getSlug());
        }
        return toDto(manufacturerRepository.save(manufacturer));
    }

    @Transactional
    public ManufacturerDto update(Long id, Manufacturer updated, Long countryId) {
        Manufacturer existing = manufacturerRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Manufacturer", id));
        Country country = countryRepository.findByIdAndActiveTrue(countryId)
                .orElseThrow(() -> new ResourceNotFoundException("Country", countryId));
        existing.setName(updated.getName());
        existing.setSlug(updated.getSlug());
        existing.setFoundedYear(updated.getFoundedYear());
        existing.setFounderName(updated.getFounderName());
        existing.setHeadquarters(updated.getHeadquarters());
        existing.setLogoUrl(updated.getLogoUrl());
        existing.setHistory(updated.getHistory());
        existing.setDescription(updated.getDescription());
        existing.setWebsiteUrl(updated.getWebsiteUrl());
        existing.setCountry(country);
        return toDto(manufacturerRepository.save(existing));
    }

    @Transactional
    public void softDelete(Long id) {
        Manufacturer m = manufacturerRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Manufacturer", id));
        m.setActive(false);
        manufacturerRepository.save(m);
    }

    private ManufacturerDto toDto(Manufacturer m) {
        return new ManufacturerDto(
                m.getId(), m.getName(), m.getSlug(), m.getFoundedYear(), m.getFounderName(),
                m.getHeadquarters(), m.getLogoUrl(), m.getHistory(), m.getDescription(),
                m.getWebsiteUrl(), m.getCountry().getId(), m.getCountry().getName(),
                m.getCountry().getCode(),
                carRepository.countByManufacturerIdAndActiveTrue(m.getId())
        );
    }
}
