package com.autovault.controller;

import com.autovault.dto.ApiResponse;
import com.autovault.dto.CarDto;
import com.autovault.dto.Model3DDto;
import com.autovault.dto.StatsDto;
import com.autovault.service.CarService;
import com.autovault.service.Model3DService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Cars", description = "Car browsing, search, and 3D model access")
public class CarController {

    private final CarService carService;
    private final Model3DService model3DService;

    @GetMapping("/cars/{id}")
    @Operation(summary = "Get car details and specs")
    public ResponseEntity<ApiResponse<CarDto>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(carService.findById(id)));
    }

    @GetMapping("/cars/search")
    @Operation(summary = "Search cars globally")
    public ResponseEntity<ApiResponse<Page<CarDto>>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Long countryId,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String bodyType,
            @RequestParam(required = false) Long manufacturerId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(carService.search(q, year, countryId, fuelType, bodyType, manufacturerId, pageable)));
    }

    @GetMapping("/cars/{id}/model3d")
    @Operation(summary = "Get 3D model metadata for a car")
    public ResponseEntity<ApiResponse<Model3DDto>> getModel3d(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(model3DService.findByCarId(id)));
    }

    @GetMapping("/cars/{id}/model3d/download")
    @Operation(summary = "Download the GLB 3D model file")
    public ResponseEntity<Resource> downloadModel(@PathVariable Long id) throws MalformedURLException {
        Resource resource = model3DService.getModelFile(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("model/gltf-binary"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/stats")
    @Operation(summary = "Get museum-wide statistics")
    public ResponseEntity<ApiResponse<StatsDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(carService.getStats()));
    }
}
