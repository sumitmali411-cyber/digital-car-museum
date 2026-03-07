package com.autovault.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "model_3d")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "car")
@ToString(exclude = "car")
public class Model3D {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false, length = 300)
    private String fileName;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(length = 10)
    private String format = "GLB";

    @Column(name = "poly_count")
    private Integer polyCount;

    @Column(name = "has_animations")
    private Boolean hasAnimations = false;

    @Column(name = "default_color", length = 7)
    private String defaultColor;

    @Column(length = 100)
    private String source;

    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @Column(length = 100)
    private String license;

    @Column(columnDefinition = "TEXT")
    private String attribution;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false, unique = true)
    private Car car;

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;
}
