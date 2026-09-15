CREATE TABLE countries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(3) NOT NULL UNIQUE,
    flag_url VARCHAR(500),
    continent VARCHAR(50),
    description TEXT,
    map_lat DECIMAL(10, 7),
    map_lng DECIMAL(10, 7),
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_country_code (code),
    INDEX idx_country_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE manufacturers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    founded_year INT,
    founder_name VARCHAR(300),
    headquarters VARCHAR(300),
    logo_url VARCHAR(500),
    history LONGTEXT,
    description TEXT,
    website_url VARCHAR(500),
    country_id BIGINT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id),
    INDEX idx_mfr_country (country_id),
    INDEX idx_mfr_slug (slug),
    INDEX idx_mfr_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cars (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(200) NOT NULL,
    slug VARCHAR(250) NOT NULL,
    year INT NOT NULL,
    generation VARCHAR(100),
    body_type VARCHAR(50),
    engine_type VARCHAR(100),
    horsepower INT,
    torque VARCHAR(50),
    transmission VARCHAR(100),
    drivetrain VARCHAR(20),
    fuel_type VARCHAR(30),
    top_speed_kmh INT,
    acceleration_0_100 DECIMAL(4,1),
    weight_kg INT,
    price_usd DECIMAL(12,2),
    description TEXT,
    image_url VARCHAR(500),
    gallery_urls JSON,
    manufacturer_id BIGINT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id),
    UNIQUE KEY uk_car_slug_year (slug, year),
    INDEX idx_car_year (year),
    INDEX idx_car_manufacturer (manufacturer_id),
    INDEX idx_car_body_type (body_type),
    INDEX idx_car_fuel_type (fuel_type),
    INDEX idx_car_active (active),
    FULLTEXT INDEX ft_car_search (model_name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE model_3d (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(300) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT,
    format VARCHAR(10) DEFAULT 'GLB',
    poly_count INT,
    has_animations BOOLEAN DEFAULT FALSE,
    default_color VARCHAR(7),
    source VARCHAR(100),
    source_url VARCHAR(500),
    license VARCHAR(100),
    attribution TEXT,
    car_id BIGINT NOT NULL UNIQUE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    INDEX idx_model3d_car (car_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE car_colors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    hex_code VARCHAR(7) NOT NULL,
    car_id BIGINT NOT NULL,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    INDEX idx_color_car (car_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE car_annotations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    pos_x FLOAT NOT NULL,
    pos_y FLOAT NOT NULL,
    pos_z FLOAT NOT NULL,
    car_id BIGINT NOT NULL,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    INDEX idx_annotation_car (car_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
