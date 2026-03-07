package com.autovault.controller;

import com.autovault.config.SecurityConfig;
import com.autovault.dto.ApiResponse;
import com.autovault.dto.CarDto;
import com.autovault.dto.StatsDto;
import com.autovault.exception.ResourceNotFoundException;
import com.autovault.service.CarService;
import com.autovault.service.Model3DService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        value = CarController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = SecurityConfig.class
        )
)
class CarControllerTest {

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
    @Autowired ObjectMapper objectMapper;

    @MockBean CarService carService;
    @MockBean Model3DService model3DService;

    private CarDto sampleCar() {
        return new CarDto(1L, "Mustang", "mustang", 1965, "Gen 1",
                "Coupe", "4.7L V8", 271, "422 Nm", "Manual", "RWD",
                "Gasoline", 190, null, 1309, null,
                "Iconic pony car.", null, List.of(),
                1L, "Ford", "ford", null, 1L, "USA", "USA",
                false, List.of());
    }

    @Test
    void getCarById_returns200() throws Exception {
        when(carService.findById(1L)).thenReturn(sampleCar());

        mockMvc.perform(get("/api/v1/cars/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.modelName").value("Mustang"));
    }

    @Test
    void getCarById_whenNotFound_returns404() throws Exception {
        when(carService.findById(99L)).thenThrow(new ResourceNotFoundException("Car", 99L));

        mockMvc.perform(get("/api/v1/cars/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void searchCars_returns200WithPage() throws Exception {
        when(carService.search(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(new PageImpl<>(List.of(sampleCar()), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/v1/cars/search").param("q", "mustang"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].modelName").value("Mustang"));
    }

    @Test
    void getStats_returns200() throws Exception {
        when(carService.getStats()).thenReturn(new StatsDto(10, 31, 190, 5, 20, 1906, 2024));

        mockMvc.perform(get("/api/v1/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalCars").value(190));
    }
}
