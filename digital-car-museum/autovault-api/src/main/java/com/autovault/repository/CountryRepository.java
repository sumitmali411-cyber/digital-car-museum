package com.autovault.repository;

import com.autovault.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {
    List<Country> findByActiveTrueOrderByDisplayOrderAsc();
    Optional<Country> findByCode(String code);
    Optional<Country> findByIdAndActiveTrue(Long id);
}
