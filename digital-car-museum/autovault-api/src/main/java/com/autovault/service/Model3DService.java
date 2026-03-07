package com.autovault.service;

import com.autovault.dto.Model3DDto;
import com.autovault.entity.Car;
import com.autovault.entity.Model3D;
import com.autovault.exception.ResourceNotFoundException;
import com.autovault.repository.CarRepository;
import com.autovault.repository.Model3DRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@RequiredArgsConstructor
public class Model3DService {

    private final Model3DRepository model3DRepository;
    private final CarRepository carRepository;

    @Value("${autovault.storage.models-path}")
    private String modelsPath;

    public Model3DDto findByCarId(Long carId) {
        Model3D model = model3DRepository.findByCarId(carId)
                .orElseThrow(() -> new ResourceNotFoundException("No 3D model found for car: " + carId));
        return toDto(model);
    }

    public Resource getModelFile(Long carId) throws MalformedURLException {
        Model3D model = model3DRepository.findByCarId(carId)
                .orElseThrow(() -> new ResourceNotFoundException("No 3D model found for car: " + carId));
        Path filePath = Paths.get(model.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) {
            throw new ResourceNotFoundException("Model file not found on disk: " + model.getFileName());
        }
        return resource;
    }

    @Transactional
    public Model3DDto upload(Long carId, MultipartFile file, String source, String license, String attribution) throws IOException {
        Car car = carRepository.findByIdAndActiveTrue(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car", carId));

        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        if (!extension.equalsIgnoreCase("glb")) {
            throw new IllegalArgumentException("Only GLB files are accepted.");
        }

        Path storageDir = Paths.get(modelsPath);
        Files.createDirectories(storageDir);

        String fileName = "car-" + carId + "-" + System.currentTimeMillis() + ".glb";
        Path targetPath = storageDir.resolve(fileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Delete existing model if any
        model3DRepository.findByCarId(carId).ifPresent(existing -> {
            try { Files.deleteIfExists(Paths.get(existing.getFilePath())); } catch (IOException ignored) {}
            model3DRepository.delete(existing);
        });

        Model3D model = Model3D.builder()
                .fileName(fileName)
                .filePath(targetPath.toString())
                .fileSizeBytes(file.getSize())
                .format("GLB")
                .source(source)
                .license(license)
                .attribution(attribution)
                .car(car)
                .build();

        return toDto(model3DRepository.save(model));
    }

    @Transactional
    public void delete(Long carId) throws IOException {
        Model3D model = model3DRepository.findByCarId(carId)
                .orElseThrow(() -> new ResourceNotFoundException("No 3D model found for car: " + carId));
        Files.deleteIfExists(Paths.get(model.getFilePath()));
        model3DRepository.delete(model);
    }

    private Model3DDto toDto(Model3D m) {
        return new Model3DDto(
                m.getId(), m.getFileName(), m.getFileSizeBytes(), m.getFormat(),
                m.getPolyCount(), m.getHasAnimations(), m.getDefaultColor(),
                m.getSource(), m.getLicense(), m.getAttribution(),
                m.getCar().getId(), m.getUploadedAt()
        );
    }
}
