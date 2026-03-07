package com.autovault.controller;

import com.autovault.dto.*;
import com.autovault.entity.Country;
import com.autovault.entity.Manufacturer;
import com.autovault.service.CarService;
import com.autovault.service.CountryService;
import com.autovault.service.ManufacturerService;
import com.autovault.service.Model3DService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin-only CRUD operations (requires ADMIN role)")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final CountryService countryService;
    private final ManufacturerService manufacturerService;
    private final CarService carService;
    private final Model3DService model3DService;

    // ─── Country CRUD ───
    @PostMapping("/countries")
    @Operation(summary = "Create a country")
    public ResponseEntity<ApiResponse<CountryDto>> createCountry(@RequestBody Country country) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(countryService.create(country)));
    }

    @PutMapping("/countries/{id}")
    @Operation(summary = "Update a country")
    public ResponseEntity<ApiResponse<CountryDto>> updateCountry(@PathVariable Long id, @RequestBody Country country) {
        return ResponseEntity.ok(ApiResponse.ok(countryService.update(id, country)));
    }

    @DeleteMapping("/countries/{id}")
    @Operation(summary = "Soft delete a country")
    public ResponseEntity<ApiResponse<Void>> deleteCountry(@PathVariable Long id) {
        countryService.softDelete(id);
        return ResponseEntity.ok(ApiResponse.ok("Country deactivated", null));
    }

    // ─── Manufacturer CRUD ───
    @PostMapping("/manufacturers")
    @Operation(summary = "Create a manufacturer")
    public ResponseEntity<ApiResponse<ManufacturerDto>> createManufacturer(
            @RequestBody Manufacturer manufacturer,
            @RequestParam Long countryId) {
        manufacturer.setCountry(new Country());
        manufacturer.getCountry().setId(countryId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(manufacturerService.create(manufacturer)));
    }

    @PutMapping("/manufacturers/{id}")
    @Operation(summary = "Update a manufacturer")
    public ResponseEntity<ApiResponse<ManufacturerDto>> updateManufacturer(
            @PathVariable Long id,
            @RequestBody Manufacturer manufacturer,
            @RequestParam Long countryId) {
        return ResponseEntity.ok(ApiResponse.ok(manufacturerService.update(id, manufacturer, countryId)));
    }

    @DeleteMapping("/manufacturers/{id}")
    @Operation(summary = "Soft delete a manufacturer")
    public ResponseEntity<ApiResponse<Void>> deleteManufacturer(@PathVariable Long id) {
        manufacturerService.softDelete(id);
        return ResponseEntity.ok(ApiResponse.ok("Manufacturer deactivated", null));
    }

    // ─── Car CRUD ───
    @PostMapping("/cars")
    @Operation(summary = "Create a car")
    public ResponseEntity<ApiResponse<CarDto>> createCar(@RequestBody @Valid CarRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(carService.create(request)));
    }

    @DeleteMapping("/cars/{id}")
    @Operation(summary = "Soft delete a car")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable Long id) {
        carService.softDelete(id);
        return ResponseEntity.ok(ApiResponse.ok("Car deactivated", null));
    }

    // ─── 3D Model Upload ───
    @PostMapping("/cars/{carId}/model3d/upload")
    @Operation(summary = "Upload a GLB 3D model for a car")
    public ResponseEntity<ApiResponse<Model3DDto>> uploadModel(
            @PathVariable Long carId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "manual") String source,
            @RequestParam(required = false) String license,
            @RequestParam(required = false) String attribution) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(model3DService.upload(carId, file, source, license, attribution)));
    }

    @DeleteMapping("/cars/{carId}/model3d")
    @Operation(summary = "Remove 3D model from a car")
    public ResponseEntity<ApiResponse<Void>> deleteModel(@PathVariable Long carId) throws IOException {
        model3DService.delete(carId);
        return ResponseEntity.ok(ApiResponse.ok("3D model removed", null));
    }
}
