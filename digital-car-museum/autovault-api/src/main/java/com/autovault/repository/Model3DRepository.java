package com.autovault.repository;

import com.autovault.entity.Model3D;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Model3DRepository extends JpaRepository<Model3D, Long> {
    Optional<Model3D> findByCarId(Long carId);
    boolean existsByCarId(Long carId);
}
