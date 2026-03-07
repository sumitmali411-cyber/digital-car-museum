package com.autovault.controller;

import com.autovault.dto.ApiResponse;
import com.autovault.dto.CountryDto;
import com.autovault.dto.ManufacturerDto;
import com.autovault.service.CountryService;
import com.autovault.service.ManufacturerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/countries")
@RequiredArgsConstructor
@Tag(name = "Countries", description = "Country browsing endpoints")
public class CountryController {

    private final CountryService countryService;
    private final ManufacturerService manufacturerService;

    @GetMapping
    @Operation(summary = "List all active countries")
    public ResponseEntity<ApiResponse<List<CountryDto>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok(countryService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get country by ID")
    public ResponseEntity<ApiResponse<CountryDto>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(countryService.findById(id)));
    }

    @GetMapping("/{id}/manufacturers")
    @Operation(summary = "Get manufacturers by country")
    public ResponseEntity<ApiResponse<List<ManufacturerDto>>> getManufacturers(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(manufacturerService.findByCountry(id)));
    }
}
