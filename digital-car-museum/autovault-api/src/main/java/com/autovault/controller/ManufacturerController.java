package com.autovault.controller;

import com.autovault.dto.ApiResponse;
import com.autovault.dto.CarDto;
import com.autovault.dto.ManufacturerDto;
import com.autovault.service.CarService;
import com.autovault.service.ManufacturerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/manufacturers")
@RequiredArgsConstructor
@Tag(name = "Manufacturers", description = "Manufacturer browsing and history")
public class ManufacturerController {

    private final ManufacturerService manufacturerService;
    private final CarService carService;

    @GetMapping
    @Operation(summary = "List all active manufacturers")
    public ResponseEntity<ApiResponse<List<ManufacturerDto>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok(manufacturerService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get manufacturer detail with history")
    public ResponseEntity<ApiResponse<ManufacturerDto>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(manufacturerService.findById(id)));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get manufacturer by slug")
    public ResponseEntity<ApiResponse<ManufacturerDto>> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(manufacturerService.findBySlug(slug)));
    }

    @GetMapping("/{id}/cars")
    @Operation(summary = "Get paginated cars for a manufacturer")
    public ResponseEntity<ApiResponse<Page<CarDto>>> getCars(
            @PathVariable Long id,
            @RequestParam(required = false) Integer year,
            @PageableDefault(size = 20, sort = "year") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(carService.findByManufacturer(id, year, pageable)));
    }

    @GetMapping("/{id}/timeline")
    @Operation(summary = "Get year-wise grouped cars for timeline view")
    public ResponseEntity<ApiResponse<Map<Integer, List<CarDto>>>> getTimeline(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(carService.getTimeline(id)));
    }
}
