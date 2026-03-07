package com.autovault.service;

import com.autovault.dto.CarColorDto;
import com.autovault.dto.CarDto;
import com.autovault.dto.CarRequest;
import com.autovault.dto.StatsDto;
import com.autovault.entity.Car;
import com.autovault.entity.CarColor;
import com.autovault.entity.Manufacturer;
import com.autovault.exception.ResourceNotFoundException;
import com.autovault.repository.CarRepository;
import com.autovault.repository.CountryRepository;
import com.autovault.repository.ManufacturerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarService {

    private final CarRepository carRepository;
    private final ManufacturerRepository manufacturerRepository;
    private final CountryRepository countryRepository;

    public Page<CarDto> findByManufacturer(Long manufacturerId, Integer year, Pageable pageable) {
        Page<Car> cars = (year != null)
                ? carRepository.findByManufacturerIdAndYearAndActiveTrue(manufacturerId, year, pageable)
                : carRepository.findByManufacturerIdAndActiveTrue(manufacturerId, pageable);
        return cars.map(this::toDto);
    }

    public CarDto findById(Long id) {
        Car car = carRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car", id));
        return toDto(car);
    }

    public Page<CarDto> search(String q, Integer year, Long countryId, String fuelType, String bodyType, Long manufacturerId, Pageable pageable) {
        return carRepository.search(q, year, countryId, fuelType, bodyType, manufacturerId, pageable).map(this::toDto);
    }

    public Map<Integer, List<CarDto>> getTimeline(Long manufacturerId) {
        List<Car> cars = carRepository.findByManufacturerIdForTimeline(manufacturerId);
        Map<Integer, List<CarDto>> timeline = new LinkedHashMap<>();
        for (Car car : cars) {
            timeline.computeIfAbsent(car.getYear(), k -> new ArrayList<>()).add(toDto(car));
        }
        return timeline;
    }

    public StatsDto getStats() {
        return new StatsDto(
                countryRepository.count(),
                manufacturerRepository.count(),
                carRepository.count(),
                carRepository.countByActiveTrueAndModel3dIsNotNull(),
                carRepository.countByActiveTrueAndFuelTypeIgnoreCase("Electric"),
                orDefault(carRepository.findEarliestYear(), 1886),
                orDefault(carRepository.findLatestYear(), 2024)
        );
    }

    @Transactional
    public CarDto create(CarRequest request) {
        Manufacturer manufacturer = manufacturerRepository.findByIdAndActiveTrue(request.manufacturerId())
                .orElseThrow(() -> new ResourceNotFoundException("Manufacturer", request.manufacturerId()));

        String slug = slugify(request.modelName());

        Car car = Car.builder()
                .modelName(request.modelName())
                .slug(slug)
                .year(request.year())
                .generation(request.generation())
                .bodyType(request.bodyType())
                .engineType(request.engineType())
                .horsepower(request.horsepower())
                .torque(request.torque())
                .transmission(request.transmission())
                .drivetrain(request.drivetrain())
                .fuelType(request.fuelType())
                .topSpeedKmh(request.topSpeedKmh())
                .acceleration0100(request.acceleration0100())
                .weightKg(request.weightKg())
                .priceUsd(request.priceUsd())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .galleryUrls(request.galleryUrls())
                .manufacturer(manufacturer)
                .build();

        if (request.colors() != null) {
            List<CarColor> colors = request.colors().stream()
                    .map(c -> CarColor.builder().name(c.name()).hexCode(c.hexCode()).car(car).build())
                    .toList();
            car.setColors(colors);
        }

        return toDto(carRepository.save(car));
    }

    @Transactional
    public void softDelete(Long id) {
        Car car = carRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car", id));
        car.setActive(false);
        carRepository.save(car);
    }

    public CarDto toDto(Car c) {
        return new CarDto(
                c.getId(), c.getModelName(), c.getSlug(), c.getYear(), c.getGeneration(),
                c.getBodyType(), c.getEngineType(), c.getHorsepower(), c.getTorque(),
                c.getTransmission(), c.getDrivetrain(), c.getFuelType(), c.getTopSpeedKmh(),
                c.getAcceleration0100(), c.getWeightKg(), c.getPriceUsd(), c.getDescription(),
                c.getImageUrl(), c.getGalleryUrls(),
                c.getManufacturer().getId(), c.getManufacturer().getName(), c.getManufacturer().getSlug(),
                c.getManufacturer().getLogoUrl(),
                c.getManufacturer().getCountry().getId(),
                c.getManufacturer().getCountry().getName(),
                c.getManufacturer().getCountry().getCode(),
                c.getModel3d() != null,
                c.getColors().stream().map(col -> new CarColorDto(col.getId(), col.getName(), col.getHexCode())).toList()
        );
    }

    private String slugify(String input) {
        return Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }

    private int orDefault(Integer value, int def) {
        return value != null ? value : def;
    }
}
