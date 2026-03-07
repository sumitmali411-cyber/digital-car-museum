package com.autovault.service;

import com.autovault.dto.ManufacturerDto;
import com.autovault.entity.Country;
import com.autovault.entity.Manufacturer;
import com.autovault.exception.ResourceNotFoundException;
import com.autovault.repository.CarRepository;
import com.autovault.repository.CountryRepository;
import com.autovault.repository.ManufacturerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ManufacturerServiceTest {

    @Mock ManufacturerRepository manufacturerRepository;
    @Mock CountryRepository countryRepository;
    @Mock CarRepository carRepository;

    @InjectMocks ManufacturerService manufacturerService;

    private Country country;
    private Manufacturer manufacturer;

    @BeforeEach
    void setUp() {
        country = Country.builder().id(1L).name("USA").code("USA").active(true).build();
        manufacturer = Manufacturer.builder()
                .id(1L).name("Ford").slug("ford")
                .country(country).active(true).build();
    }

    @Test
    void findByCountry_returnsList() {
        when(manufacturerRepository.findByCountryIdAndActiveTrueOrderByNameAsc(1L))
                .thenReturn(List.of(manufacturer));
        when(carRepository.countByManufacturerIdAndActiveTrue(1L)).thenReturn(7L);

        List<ManufacturerDto> result = manufacturerService.findByCountry(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).name()).isEqualTo("Ford");
        assertThat(result.get(0).carCount()).isEqualTo(7L);
    }

    @Test
    void findById_whenExists_returnsDto() {
        when(manufacturerRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(manufacturer));
        when(carRepository.countByManufacturerIdAndActiveTrue(1L)).thenReturn(7L);

        ManufacturerDto result = manufacturerService.findById(1L);

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.slug()).isEqualTo("ford");
    }

    @Test
    void findBySlug_whenExists_returnsDto() {
        when(manufacturerRepository.findBySlugAndActiveTrue("ford")).thenReturn(Optional.of(manufacturer));
        when(carRepository.countByManufacturerIdAndActiveTrue(1L)).thenReturn(7L);

        ManufacturerDto result = manufacturerService.findBySlug("ford");

        assertThat(result.name()).isEqualTo("Ford");
    }

    @Test
    void findBySlug_whenNotFound_throws() {
        when(manufacturerRepository.findBySlugAndActiveTrue("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> manufacturerService.findBySlug("unknown"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_whenSlugUnique_saves() {
        when(manufacturerRepository.existsBySlug("ford")).thenReturn(false);
        when(manufacturerRepository.save(manufacturer)).thenReturn(manufacturer);
        when(carRepository.countByManufacturerIdAndActiveTrue(1L)).thenReturn(0L);

        ManufacturerDto result = manufacturerService.create(manufacturer);

        assertThat(result.name()).isEqualTo("Ford");
        verify(manufacturerRepository).save(manufacturer);
    }

    @Test
    void create_whenSlugDuplicate_throws() {
        when(manufacturerRepository.existsBySlug("ford")).thenReturn(true);

        assertThatThrownBy(() -> manufacturerService.create(manufacturer))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("ford");
    }
}
