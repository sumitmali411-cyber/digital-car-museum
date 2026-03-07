package com.autovault.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cars")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"manufacturer", "model3d", "colors", "annotations"})
@ToString(exclude = {"manufacturer", "model3d", "colors", "annotations"})
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "model_name", nullable = false, length = 200)
    private String modelName;

    @Column(nullable = false, length = 250)
    private String slug;

    @Column(nullable = false)
    private Integer year;

    @Column(length = 100)
    private String generation;

    @Column(name = "body_type", length = 50)
    private String bodyType;

    @Column(name = "engine_type", length = 100)
    private String engineType;

    private Integer horsepower;

    @Column(length = 50)
    private String torque;

    @Column(length = 100)
    private String transmission;

    @Column(length = 20)
    private String drivetrain;

    @Column(name = "fuel_type", length = 30)
    private String fuelType;

    @Column(name = "top_speed_kmh")
    private Integer topSpeedKmh;

    @Column(name = "acceleration_0_100", precision = 4, scale = 1)
    private BigDecimal acceleration0100;

    @Column(name = "weight_kg")
    private Integer weightKg;

    @Column(name = "price_usd", precision = 12, scale = 2)
    private BigDecimal priceUsd;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "gallery_urls", columnDefinition = "JSON")
    private List<String> galleryUrls;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manufacturer_id", nullable = false)
    private Manufacturer manufacturer;

    @Column(nullable = false)
    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "car", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Model3D model3d;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CarColor> colors = new ArrayList<>();

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CarAnnotation> annotations = new ArrayList<>();
}
