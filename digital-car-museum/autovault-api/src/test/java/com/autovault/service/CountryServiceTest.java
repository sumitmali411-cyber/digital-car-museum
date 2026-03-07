package com.autovault.service;

import com.autovault.dto.CountryDto;
import com.autovault.entity.Country;
import com.autovault.exception.ResourceNotFoundException;
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
class CountryServiceTest {

    @Mock CountryRepository countryRepository;
    @Mock ManufacturerRepository manufacturerRepository;

    @InjectMocks CountryService countryService;

    private Country country;

    @BeforeEach
    void setUp() {
        country = Country.builder()
                .id(1L).name("USA").code("USA").continent("North America")
                .displayOrder(1).active(true).build();
    }

    @Test
    void findAll_returnsOrderedList() {
        Country second = Country.builder().id(2L).name("Germany").code("DEU")
                .displayOrder(2).active(true).build();
        when(countryRepository.findByActiveTrueOrderByDisplayOrderAsc())
                .thenReturn(List.of(country, second));
        when(manufacturerRepository.countByCountryIdAndActiveTrue(anyLong())).thenReturn(0L);

        List<CountryDto> result = countryService.findAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).name()).isEqualTo("USA");
        assertThat(result.get(1).name()).isEqualTo("Germany");
    }

    @Test
    void findById_whenExists_returnsDto() {
        when(countryRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(country));
        when(manufacturerRepository.countByCountryIdAndActiveTrue(1L)).thenReturn(3L);

        CountryDto result = countryService.findById(1L);

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("USA");
        assertThat(result.manufacturerCount()).isEqualTo(3L);
    }

    @Test
    void findById_whenNotFound_throws() {
        when(countryRepository.findByIdAndActiveTrue(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> countryService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void softDelete_setsActiveFalse() {
        when(countryRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(country));
        when(countryRepository.save(country)).thenReturn(country);

        countryService.softDelete(1L);

        assertThat(country.getActive()).isFalse();
        verify(countryRepository).save(country);
    }

    @Test
    void softDelete_whenNotFound_throws() {
        when(countryRepository.findByIdAndActiveTrue(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> countryService.softDelete(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
