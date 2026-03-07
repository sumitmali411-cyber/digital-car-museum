package com.autovault.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "countries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "manufacturers")
@ToString(exclude = "manufacturers")
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 3, unique = true)
    private String code;

    @Column(name = "flag_url", length = 500)
    private String flagUrl;

    @Column(length = 50)
    private String continent;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "map_lat", precision = 10, scale = 7)
    private BigDecimal mapLat;

    @Column(name = "map_lng", precision = 10, scale = 7)
    private BigDecimal mapLng;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(nullable = false)
    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "country", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Manufacturer> manufacturers = new ArrayList<>();
}
