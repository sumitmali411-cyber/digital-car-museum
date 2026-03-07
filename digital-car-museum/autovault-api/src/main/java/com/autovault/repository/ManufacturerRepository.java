package com.autovault.repository;

import com.autovault.entity.Manufacturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ManufacturerRepository extends JpaRepository<Manufacturer, Long> {
    List<Manufacturer> findByCountryIdAndActiveTrueOrderByNameAsc(Long countryId);
    List<Manufacturer> findByActiveTrueOrderByNameAsc();
    Optional<Manufacturer> findBySlugAndActiveTrue(String slug);
    Optional<Manufacturer> findByIdAndActiveTrue(Long id);
    boolean existsBySlug(String slug);
    long countByCountryIdAndActiveTrue(Long countryId);
}
