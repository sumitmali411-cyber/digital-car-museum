package com.autovault.service;

import com.autovault.dto.CarDto;
import com.autovault.dto.StatsDto;
import com.autovault.entity.Car;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarServiceTest {

    @Mock CarRepository carRepository;
    @Mock ManufacturerRepository manufacturerRepository;
    @Mock CountryRepository countryRepository;

    @InjectMocks CarService carService;

    private Car car;

    @BeforeEach
    void setUp() {
        Country country = Country.builder()
                .id(1L).name("USA").code("USA").active(true).build();
        Manufacturer manufacturer = Manufacturer.builder()
                .id(1L).name("Ford").slug("ford").country(country).active(true).build();
        car = Car.builder()
                .id(1L).modelName("Mustang").slug("mustang").year(1965)
                .manufacturer(manufacturer).active(true).build();
    }

    @Test
    void findById_whenExists_returnsDto() {
        when(carRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(car));

        CarDto result = carService.findById(1L);

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.modelName()).isEqualTo("Mustang");
        assertThat(result.manufacturerName()).isEqualTo("Ford");
    }

    @Test
    void findById_whenNotFound_throwsResourceNotFoundException() {
        when(carRepository.findByIdAndActiveTrue(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> carService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void findByManufacturer_withYear_callsYearFilteredQuery() {
        Pageable pageable = PageRequest.of(0, 20);
        when(carRepository.findByManufacturerIdAndYearAndActiveTrue(1L, 1965, pageable))
                .thenReturn(new PageImpl<>(List.of(car)));

        Page<CarDto> result = carService.findByManufacturer(1L, 1965, pageable);

        assertThat(result.getContent()).hasSize(1);
        verify(carRepository).findByManufacturerIdAndYearAndActiveTrue(1L, 1965, pageable);
        verify(carRepository, never()).findByManufacturerIdAndActiveTrue(any(), any());
    }

    @Test
    void findByManufacturer_withoutYear_callsSimpleQuery() {
        Pageable pageable = PageRequest.of(0, 20);
        when(carRepository.findByManufacturerIdAndActiveTrue(1L, pageable))
                .thenReturn(new PageImpl<>(List.of(car)));

        Page<CarDto> result = carService.findByManufacturer(1L, null, pageable);

        assertThat(result.getContent()).hasSize(1);
        verify(carRepository).findByManufacturerIdAndActiveTrue(1L, pageable);
        verify(carRepository, never()).findByManufacturerIdAndYearAndActiveTrue(any(), any(), any());
    }

    @Test
    void search_delegatesToRepository() {
        Pageable pageable = PageRequest.of(0, 20);
        when(carRepository.search("mustang", null, null, null, null, null, pageable))
                .thenReturn(new PageImpl<>(List.of(car)));

        Page<CarDto> result = carService.search("mustang", null, null, null, null, null, pageable);

        assertThat(result.getContent()).hasSize(1);
        verify(carRepository).search("mustang", null, null, null, null, null, pageable);
    }

    @Test
    void getStats_returnsAggregatedValues() {
        when(countryRepository.count()).thenReturn(10L);
        when(manufacturerRepository.count()).thenReturn(31L);
        when(carRepository.count()).thenReturn(190L);
        when(carRepository.countByActiveTrueAndModel3dIsNotNull()).thenReturn(5L);
        when(carRepository.countByActiveTrueAndFuelTypeIgnoreCase("Electric")).thenReturn(20L);
        when(carRepository.findEarliestYear()).thenReturn(1906);
        when(carRepository.findLatestYear()).thenReturn(2024);

        StatsDto stats = carService.getStats();

        assertThat(stats.totalCountries()).isEqualTo(10L);
        assertThat(stats.totalCars()).isEqualTo(190L);
        assertThat(stats.earliestYear()).isEqualTo(1906);
    }

    @Test
    void softDelete_setsActiveFalse() {
        when(carRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(car));
        when(carRepository.save(car)).thenReturn(car);

        carService.softDelete(1L);

        assertThat(car.getActive()).isFalse();
        verify(carRepository).save(car);
    }
}
