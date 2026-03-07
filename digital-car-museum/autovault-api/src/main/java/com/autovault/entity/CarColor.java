package com.autovault.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "car_colors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "car")
@ToString(exclude = "car")
public class CarColor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "hex_code", nullable = false, length = 7)
    private String hexCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;
}
