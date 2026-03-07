package com.autovault.repository;

import com.autovault.entity.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    Page<Car> findByManufacturerIdAndActiveTrue(Long manufacturerId, Pageable pageable);

    Page<Car> findByManufacturerIdAndYearAndActiveTrue(Long manufacturerId, Integer year, Pageable pageable);

    Optional<Car> findByIdAndActiveTrue(Long id);

    @Query("SELECT DISTINCT c.year FROM Car c WHERE c.manufacturer.id = :mfrId AND c.active = true ORDER BY c.year ASC")
    List<Integer> findDistinctYearsByManufacturerId(@Param("mfrId") Long mfrId);

    @Query("""
            SELECT c FROM Car c
            WHERE c.active = true
            AND (:q IS NULL OR LOWER(c.modelName) LIKE LOWER(CONCAT('%', :q, '%'))
                           OR LOWER(c.description) LIKE LOWER(CONCAT('%', :q, '%')))
            AND (:year IS NULL OR c.year = :year)
            AND (:countryId IS NULL OR c.manufacturer.country.id = :countryId)
            AND (:fuelType IS NULL OR LOWER(c.fuelType) = LOWER(:fuelType))
            AND (:bodyType IS NULL OR LOWER(c.bodyType) = LOWER(:bodyType))
            AND (:manufacturerId IS NULL OR c.manufacturer.id = :manufacturerId)
            """)
    Page<Car> search(
            @Param("q") String q,
            @Param("year") Integer year,
            @Param("countryId") Long countryId,
            @Param("fuelType") String fuelType,
            @Param("bodyType") String bodyType,
            @Param("manufacturerId") Long manufacturerId,
            Pageable pageable
    );

    @Query("SELECT c FROM Car c WHERE c.manufacturer.id = :mfrId AND c.active = true ORDER BY c.year ASC")
    List<Car> findByManufacturerIdForTimeline(@Param("mfrId") Long mfrId);

    long countByManufacturerIdAndActiveTrue(Long manufacturerId);
    long countByActiveTrueAndModel3dIsNotNull();
    long countByActiveTrueAndFuelTypeIgnoreCase(String fuelType);

    @Query("SELECT MIN(c.year) FROM Car c WHERE c.active = true")
    Integer findEarliestYear();

    @Query("SELECT MAX(c.year) FROM Car c WHERE c.active = true")
    Integer findLatestYear();
}
