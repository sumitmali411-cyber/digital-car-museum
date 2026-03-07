package com.autovault.controller;

import com.autovault.config.SecurityConfig;
import com.autovault.dto.CountryDto;
import com.autovault.dto.ManufacturerDto;
import com.autovault.exception.ResourceNotFoundException;
import com.autovault.service.CountryService;
import com.autovault.service.ManufacturerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        value = CountryController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = SecurityConfig.class
        )
)
class CountryControllerTest {

    @TestConfiguration
    static class TestSecurityConfig {
        @Bean
        SecurityFilterChain testChain(HttpSecurity http) throws Exception {
            http.csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }

    @Autowired MockMvc mockMvc;

    @MockBean CountryService countryService;
    @MockBean ManufacturerService manufacturerService;

    private CountryDto sampleCountry() {
        return new CountryDto(1L, "USA", "USA", null, "North America",
                "United States", null, null, 1, 3L);
    }

    @Test
    void getAllCountries_returns200() throws Exception {
        when(countryService.findAll()).thenReturn(List.of(sampleCountry()));

        mockMvc.perform(get("/api/v1/countries"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].name").value("USA"));
    }

    @Test
    void getCountryById_returns200() throws Exception {
        when(countryService.findById(1L)).thenReturn(sampleCountry());

        mockMvc.perform(get("/api/v1/countries/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.code").value("USA"));
    }

    @Test
    void getCountryById_whenNotFound_returns404() throws Exception {
        when(countryService.findById(99L)).thenThrow(new ResourceNotFoundException("Country", 99L));

        mockMvc.perform(get("/api/v1/countries/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getManufacturersByCountry_returns200() throws Exception {
        ManufacturerDto mfr = new ManufacturerDto(1L, "Ford", "ford", 1903,
                "Henry Ford", "Dearborn, MI", null, null, null,
                null, 1L, "USA", "USA", 7L);
        when(manufacturerService.findByCountry(1L)).thenReturn(List.of(mfr));

        mockMvc.perform(get("/api/v1/countries/1/manufacturers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].name").value("Ford"));
    }
}
