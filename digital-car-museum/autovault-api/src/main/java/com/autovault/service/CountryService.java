package com.autovault.service;

import com.autovault.dto.CountryDto;
import com.autovault.entity.Country;
import com.autovault.exception.ResourceNotFoundException;
import com.autovault.repository.CountryRepository;
import com.autovault.repository.ManufacturerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CountryService {

    private final CountryRepository countryRepository;
    private final ManufacturerRepository manufacturerRepository;

    public List<CountryDto> findAll() {
        return countryRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public CountryDto findById(Long id) {
        Country country = countryRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country", id));
        return toDto(country);
    }

    @Transactional
    public CountryDto create(Country country) {
        return toDto(countryRepository.save(country));
    }

    @Transactional
    public CountryDto update(Long id, Country updated) {
        Country existing = countryRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country", id));
        existing.setName(updated.getName());
        existing.setCode(updated.getCode());
        existing.setFlagUrl(updated.getFlagUrl());
        existing.setContinent(updated.getContinent());
        existing.setDescription(updated.getDescription());
        existing.setMapLat(updated.getMapLat());
        existing.setMapLng(updated.getMapLng());
        existing.setDisplayOrder(updated.getDisplayOrder());
        return toDto(countryRepository.save(existing));
    }

    @Transactional
    public void softDelete(Long id) {
        Country country = countryRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country", id));
        country.setActive(false);
        countryRepository.save(country);
    }

    private CountryDto toDto(Country c) {
        return new CountryDto(
                c.getId(), c.getName(), c.getCode(), c.getFlagUrl(),
                c.getContinent(), c.getDescription(), c.getMapLat(), c.getMapLng(),
                c.getDisplayOrder(),
                manufacturerRepository.countByCountryIdAndActiveTrue(c.getId())
        );
    }
}
