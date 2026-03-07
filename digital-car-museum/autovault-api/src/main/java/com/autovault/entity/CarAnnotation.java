package com.autovault.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "car_annotations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "car")
@ToString(exclude = "car")
public class CarAnnotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String label;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "pos_x", nullable = false)
    private Float posX;

    @Column(name = "pos_y", nullable = false)
    private Float posY;

    @Column(name = "pos_z", nullable = false)
    private Float posZ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;
}
