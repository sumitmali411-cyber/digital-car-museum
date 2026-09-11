-- V4: Seed ~190 cars across 31 manufacturers
-- Slugs computed via: NFD-normalize → strip non-ASCII → lowercase → non-alnum→'-' → trim '-'

INSERT INTO cars
  (model_name, slug, year, generation, body_type, engine_type, horsepower, torque, transmission, drivetrain, fuel_type, top_speed_kmh, acceleration_0_100, weight_kg, price_usd, description, image_url, gallery_urls, manufacturer_id)
VALUES

-- ── Ford (1) ─────────────────────────────────────────────────────────────────
('Model T',        'model-t',    1908, 'Gen 1', 'Touring Car', '2.9L I4',          20,  '83 Nm',   'Manual 2-speed',  'RWD', 'Gasoline',  72,  NULL, 540,   825.00,
 'The car that put America on wheels. Mass production revolutionised personal transport.',
 NULL, '[]', 1),
('Mustang',        'mustang',    1965, 'Gen 1', 'Coupe',       '4.7L V8',         271, '422 Nm',  'Manual 4-speed',  'RWD', 'Gasoline', 190,  NULL, 1309,  2372.00,
 'The original pony car. Launched the Mustang nameplate that endures to this day.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/1965_Ford_Mustang_289.jpg/1280px-1965_Ford_Mustang_289.jpg', '[]', 1),
('Mustang',        'mustang',    2024, 'Gen 7', 'Coupe',       '5.0L V8',         480, '570 Nm',  'Manual 6-speed',  'RWD', 'Gasoline', 250,  4.3,  1680, 29995.00,
 'The seventh-generation Mustang brings modern tech with classic V8 muscle.',
 NULL, '[]', 1),
('GT40',           'gt40',       1966, 'Mk II', 'Sports Car',  '7.0L V8',         485, '651 Nm',  'Manual 4-speed',  'RWD', 'Gasoline', 322,  NULL, 1001,  NULL,
 'Le Mans legend that broke Ferrari''s winning streak with four consecutive victories 1966–1969.',
 NULL, '[]', 1),
('F-150',          'f-150',      2022, 'Gen 14','Truck',       '3.5L EcoBoost V6',400, '691 Nm',  'Automatic 10-spd','RWD', 'Gasoline', 180,  5.9,  2146, 29000.00,
 'America''s best-selling vehicle for over 40 years. The benchmark full-size pickup.',
 NULL, '[]', 1),
('Bronco',         'bronco',     2021, 'Gen 6', 'SUV',         '2.3L EcoBoost I4',300, '441 Nm',  'Manual 7-speed',  '4WD', 'Gasoline', 177,  6.7,  2063, 29995.00,
 'The Bronco''s triumphant return after 25 years; a capable off-roader with heritage styling.',
 NULL, '[]', 1),
('Ford GT',        'ford-gt',    2005, 'Gen 2', 'Sports Car',  '5.4L Supercharged V8',550,'678 Nm','Manual 6-speed',  'RWD', 'Gasoline', 330,  3.3,  1543, 139995.00,
 'A modern homage to the GT40, featuring Ford''s supercharged V8 and a mid-engine layout.',
 NULL, '[]', 1),

-- ── Chevrolet (2) ─────────────────────────────────────────────────────────────
('Corvette C1',    'corvette-c1',1953, 'C1',    'Sports Car',  '3.9L I6',         150, '325 Nm',  'Automatic 2-spd', 'RWD', 'Gasoline', 194,  NULL, 1181,  3498.00,
 'America''s original sports car, launched Chevrolet''s legendary Corvette line.',
 NULL, '[]', 2),
('Corvette C7',    'corvette-c7',2014, 'C7',    'Sports Car',  '6.2L V8',         460, '630 Nm',  'Manual 7-speed',  'RWD', 'Gasoline', 290,  3.8,  1528, 51000.00,
 'The Stingray name returns on the seventh-generation Corvette with aluminium structure.',
 NULL, '[]', 2),
('Corvette C8',    'corvette-c8',2020, 'C8',    'Sports Car',  '6.2L V8',         495, '637 Nm',  'Automatic 8-DCT', 'RWD', 'Gasoline', 296,  2.9,  1527, 59995.00,
 'The first mid-engine production Corvette, a revolution in 67 years of the nameplate.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/2020_Chevrolet_Corvette_Stingray_%28C8%29_in_Rapid_Blue%2C_front_8.15.20.jpg/1280px-2020_Chevrolet_Corvette_Stingray_%28C8%29_in_Rapid_Blue%2C_front_8.15.20.jpg', '[]', 2),
('Camaro SS',      'camaro-ss',  1969, 'Gen 1', 'Coupe',       '6.5L V8',         375, '610 Nm',  'Manual 4-speed',  'RWD', 'Gasoline', 210,  NULL, 1519,  3300.00,
 'Muscle-car icon of the late 1960s, still revered for its raw American V8 power.',
 NULL, '[]', 2),
('Camaro ZL1',     'camaro-zl1', 2017, 'Gen 6', 'Coupe',       '6.2L Supercharged V8',650,'881 Nm','Automatic 10-spd','RWD', 'Gasoline', 320,  3.5,  1761, 62135.00,
 'The most powerful Camaro ever with Magnetic Ride Control and 650 supercharged horsepower.',
 NULL, '[]', 2),
('Silverado',      'silverado',  2022, 'Gen 4', 'Truck',       '5.3L V8',         355, '519 Nm',  'Automatic 8-spd', 'RWD', 'Gasoline', 177,  6.5,  2137, 34100.00,
 'A cornerstone of the full-size truck market with a range of powerful engine options.',
 NULL, '[]', 2),
('Bel Air',        'bel-air',    1957, 'Gen 2', 'Sedan',       '4.6L V8',         283, '400 Nm',  'Automatic 2-spd', 'RWD', 'Gasoline', 175,  NULL, 1645,  2611.00,
 'Symbol of 1950s American optimism, featuring iconic tailfins and two-tone paint.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/1957_Chevrolet_Bel_Air_hardtop_at_Amelia_Island_in_2012.jpg/1280px-1957_Chevrolet_Bel_Air_hardtop_at_Amelia_Island_in_2012.jpg', '[]', 2),

-- ── Tesla (3) ─────────────────────────────────────────────────────────────────
('Roadster',           'roadster',        2008, 'Gen 1','Sports Car','Electric Dual Motor',248,'N/A','Single-speed','RWD','Electric',201,3.9,1235,109000.00,
 'The car that proved electric vehicles could be exciting. Tesla''s first production model.',
 NULL,'[]',3),
('Model S P100D',      'model-s-p100d',   2016, 'P100D','Sedan','Electric Dual Motor',     503,'N/A','Single-speed','AWD','Electric',249,2.5,2241, 99000.00,
 'Ludicrous Mode made this the world''s quickest production sedan at launch.',
 NULL,'[]',3),
('Model 3 Performance','model-3-performance',2019,'Gen 1','Sedan','Electric Dual Motor',   450,'N/A','Single-speed','AWD','Electric',250,3.2,1847, 55990.00,
 'The most affordable Tesla yet, offering supercar acceleration in an everyday package.',
 NULL,'[]',3),
('Model X',            'model-x',         2021, 'Gen 2','SUV',  'Electric Dual Motor',     670,'N/A','Single-speed','AWD','Electric',250,2.6,2459, 89990.00,
 'Tesla''s flagship SUV with Falcon Wing doors and class-leading range.',
 NULL,'[]',3),
('Model S Plaid',      'model-s-plaid',   2021, 'Plaid','Sedan','Electric Tri Motor',     1020,'N/A','Single-speed','AWD','Electric',322,2.0,2162,129990.00,
 'Triple-motor Plaid model breaks the two-second barrier in production car acceleration.',
 NULL,'[]',3),
('Cybertruck',         'cybertruck',      2024, 'Gen 1','Truck', 'Electric Tri Motor',     845,'N/A','Single-speed','AWD','Electric',209,2.6,3130, 79990.00,
 'Tesla''s angular stainless-steel electric pickup, redefining the truck form factor.',
 NULL,'[]',3),

-- ── BMW (4) ─────────────────────────────────────────────────────────────────
('2002',        '2002',     1968,'E10',  'Sedan',    '2.0L I4',        100,'152 Nm','Manual 4-speed', 'RWD','Gasoline',175,  NULL,940,  2450.00,
 'The car that created the sports sedan genre, father of all M3s and M5s to follow.',
 NULL,'[]',4),
('E30 M3',      'e30-m3',   1987,'E30',  'Coupe',    '2.3L I4',        200,'230 Nm','Manual 5-speed', 'RWD','Gasoline',235,  6.5, 1165, 35000.00,
 'Homologation special for touring car racing; now one of the most coveted BMWs ever.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/BMW_E30_M3_Gruppe_A_front-1.jpg/1280px-BMW_E30_M3_Gruppe_A_front-1.jpg','[]',4),
('M5 E39',      'm5-e39',   1999,'E39',  'Sedan',    '5.0L V8',        400,'500 Nm','Manual 6-speed', 'RWD','Gasoline',250,  5.3,1785, 75000.00,
 'Widely regarded as the greatest M5 ever made; the benchmark super saloon.',
 NULL,'[]',4),
('M3 E46',      'm3-e46',   2001,'E46',  'Coupe',    '3.2L I6',        343,'365 Nm','Manual 6-speed', 'RWD','Gasoline',250,  5.0,1570, 45000.00,
 'The high-revving naturally aspirated S54 engine made this M3 a drivers'' icon.',
 NULL,'[]',4),
('M5 F90',      'm5-f90',   2018,'F90',  'Sedan',    '4.4L Twin-Turbo V8',600,'750 Nm','Automatic 8-spd','AWD','Gasoline',305,  3.4,1855,103500.00,
 'Competition Package M5 with M xDrive AWD; combines motorsport DNA with everyday luxury.',
 NULL,'[]',4),
('i8',          'i8',       2014,'I12',  'Sports Car','1.5L I3 + Electric Motor',362,'570 Nm','Automatic 6-spd','AWD','Hybrid',250,  4.4,1485,135925.00,
 'BMW''s plug-in hybrid sports car with butterfly doors and carbon fibre tub.',
 NULL,'[]',4),
('M2',          'm2',       2023,'G87',  'Coupe',    '3.0L Twin-Turbo I6',453,'550 Nm','Manual 6-speed', 'RWD','Gasoline',285,  4.1,1725, 63195.00,
 'The purist''s choice; rear-wheel drive, manual gearbox, and a chassis tuned for the track.',
 NULL,'[]',4),
('Z8',          'z8',       2000,'E52',  'Convertible','5.0L V8',      400,'500 Nm','Manual 6-speed', 'RWD','Gasoline',250,  4.7,1585,128000.00,
 'A James Bond car: handcrafted aluminium roadster with the E39 M5''s V8.',
 NULL,'[]',4),

-- ── Mercedes-Benz (5) ────────────────────────────────────────────────────────
('300 SL Gullwing',  '300-sl-gullwing', 1954,'W198','Sports Car','3.0L I6', 215,'270 Nm','Manual 4-speed', 'RWD','Gasoline',260,  NULL,1295,  NULL,
 'The original Gullwing; first production car with fuel injection and iconic upward-opening doors.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Mercedes_Benz_300SL_%281954%29.jpg/1280px-Mercedes_Benz_300SL_%281954%29.jpg','[]',5),
('SLS AMG',          'sls-amg',         2010,'C197','Sports Car','6.2L V8', 571,'650 Nm','Automatic 7-DCT','RWD','Gasoline',317,  3.8,1620,185000.00,
 'SLS revived the Gullwing silhouette with a hand-built AMG 6.2-litre V8.',
 NULL,'[]',5),
('G63 AMG',          'g63-amg',         2022,'W463A','SUV',      '4.0L V8', 585,'850 Nm','Automatic 9-spd','AWD','Gasoline',220,  4.5,2560,175000.00,
 'The G-Wagen icon with AMG twin-turbo V8; off-road capability meets extreme performance.',
 NULL,'[]',5),
('S-Class',          's-class',         2014,'W222','Sedan',     '3.0L V6', 333,'480 Nm','Automatic 9-spd','RWD','Gasoline',250,  5.5,1945, 91700.00,
 'The benchmark luxury saloon, pioneering safety and comfort technologies for decades.',
 NULL,'[]',5),
('C63 AMG',          'c63-amg',         2015,'W205','Sedan',     '4.0L V8', 476,'650 Nm','Automatic 7-spd','RWD','Gasoline',290,  4.0,1700, 67000.00,
 'First V8 C63 to use a twin-turbo, marrying AMG fury with everyday usability.',
 NULL,'[]',5),
('EQS',              'eqs',             2022,'V297','Sedan',     'Electric Dual Motor',523,'855 Nm','Single-speed','AWD','Electric',210,  4.3,2585,104400.00,
 'Mercedes flagship electric saloon with a 107.8 kWh battery and 700 km range.',
 NULL,'[]',5),
('300 SEL 6.3',      '300-sel-6-3',     1968,'W108','Sedan',     '6.3L V8', 250,'500 Nm','Automatic 4-spd','RWD','Gasoline',220,  NULL,1750,  NULL,
 'The first Mercedes-AMG collaboration; the 600''s 6.3 V8 shoehorned into a mid-size saloon.',
 NULL,'[]',5),

-- ── Volkswagen (6) ───────────────────────────────────────────────────────────
('Beetle',         'beetle',        1938,'Gen 1', 'Hatchback','1.1L I4',          25,  '65 Nm','Manual 4-speed', 'RWD','Gasoline',105,  NULL, 760,   395.00,
 'The People''s Car; one of the best-selling cars in history with over 21 million units made.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/VW_Beetle_1971.jpg/1280px-VW_Beetle_1971.jpg','[]',6),
('Golf GTI Mk1',   'golf-gti-mk1',  1976,'Mk I', 'Hatchback','1.6L I4',         110, '140 Nm','Manual 4-speed', 'FWD','Gasoline',182,  9.0, 810,  9800.00,
 'The original hot hatch that defined the genre; a performance icon in everyday clothes.',
 NULL,'[]',6),
('Golf GTI Mk8',   'golf-gti-mk8',  2021,'Mk VIII','Hatchback','2.0L Turbo I4', 245, '370 Nm','Automatic 7-DCT','FWD','Gasoline',250,  6.3,1432, 31000.00,
 'The eighth-generation GTI retains driver-focused character with modern digital cockpit.',
 NULL,'[]',6),
('Golf R',         'golf-r',        2021,'Mk VIII','Hatchback','2.0L Turbo I4', 320, '420 Nm','Automatic 7-DCT','AWD','Gasoline',270,  4.7,1553, 41000.00,
 'The all-wheel-drive Golf flagship with 320 hp and a subtle, stealthy appearance.',
 NULL,'[]',6),
('ID.4',           'id-4',          2021,'Gen 1','SUV',       'Electric Motor',   204, '310 Nm','Single-speed',  'RWD','Electric', 160,  8.5,2124, 43000.00,
 'Volkswagen''s mass-market electric SUV built on the dedicated MEB platform.',
 NULL,'[]',6),
('Phaeton',        'phaeton',       2002,'Gen 1','Sedan',     '6.0L W12',         420, '570 Nm','Automatic 5-spd','AWD','Gasoline',250,  5.9,2550, 70000.00,
 'VW''s ultra-luxury saloon; hand-built in Dresden''s glass factory alongside Bentley.',
 NULL,'[]',6),
('Touareg',        'touareg',       2020,'Gen 3','SUV',       '3.0L V6 Turbo',    340, '450 Nm','Automatic 8-spd','AWD','Gasoline',245,  5.9,2210, 55000.00,
 'The flagship Volkswagen SUV sharing platforms with Porsche Cayenne and Audi Q7.',
 NULL,'[]',6),

-- ── Porsche (7) ──────────────────────────────────────────────────────────────
('911 964',         '911-964',         1989,'964',  'Sports Car','3.6L Flat-6',        250, '310 Nm','Manual 5-speed', 'RWD','Gasoline',260,  5.7,1350, 65000.00,
 'The first major 911 redesign brought wider body, coil springs and Tiptronic option.',
 NULL,'[]',7),
('911 GT3 RS',      '911-gt3-rs',      2023,'992',  'Sports Car','4.0L Flat-6',        525, '465 Nm','Automatic 7-PDK','RWD','Gasoline',296,  3.2,1450,225250.00,
 'Street-legal race car with DRS, massive downforce wing and naturally aspirated flat-six.',
 NULL,'[]',7),
('918 Spyder',      '918-spyder',      2013,'918',  'Sports Car','4.6L V8 + 2 E-Motors',887,'1280 Nm','Automatic 7-PDK','AWD','Hybrid', 345,  2.5,1674,845000.00,
 'Hypercar plug-in hybrid; lap record holder that rewrote performance benchmarks.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Porsche_918_Spyder_–_Frontansicht_%281%29%2C_5._April_2012%2C_Düsseldorf.jpg/1280px-Porsche_918_Spyder_–_Frontansicht_%281%29%2C_5._April_2012%2C_Düsseldorf.jpg','[]',7),
('Carrera GT',      'carrera-gt',      2003,'980',  'Sports Car','5.7L V10',           612, '590 Nm','Manual 6-speed', 'RWD','Gasoline',330,  3.9,1380,440000.00,
 'A carbon-fibre V10 roadster regarded as one of the greatest analogue driving experiences.',
 NULL,'[]',7),
('Taycan Turbo S',  'taycan-turbo-s',  2020,'J1',   'Sports Car','Electric Dual Motor', 761,'1050 Nm','Automatic 2-spd','AWD','Electric',260,  2.8,2370,186350.00,
 'Porsche''s electric flagship, delivering Taycan DNA with 761 hp and 2-speed rear transmission.',
 NULL,'[]',7),
('911 Turbo S',     '911-turbo-s',     2021,'992',  'Sports Car','3.8L Biturbo Flat-6', 650,'800 Nm','Automatic 8-PDK','AWD','Gasoline',330,  2.7,1640,207000.00,
 'The definitive all-weather everyday supercar; 650 hp and AWD traction for all conditions.',
 NULL,'[]',7),
('Cayman GT4',      'cayman-gt4',      2020,'982',  'Sports Car','4.0L Flat-6',        420, '420 Nm','Manual 6-speed', 'RWD','Gasoline',304,  4.4,1420, 99950.00,
 'Naturally aspirated mid-engine GT4 uses the 911 GT3''s suspension and engine.',
 NULL,'[]',7),
('Boxster',         'boxster',         1997,'986',  'Convertible','2.5L Flat-6',       204, '245 Nm','Manual 5-speed', 'RWD','Gasoline',240,  6.4,1260, 40000.00,
 'The Boxster revived Porsche''s fortunes in the 1990s; a perfectly balanced mid-engine roadster.',
 NULL,'[]',7),

-- ── Audi (8) ─────────────────────────────────────────────────────────────────
('Quattro',     'quattro',     1980,'Ur-Quattro','Coupe',    '2.1L Turbo I5',      200, '285 Nm','Manual 5-speed', 'AWD','Gasoline',220,  7.1,1350, 32000.00,
 'The car that changed rallying forever; Audi''s first AWD road car inspired a revolution.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Audi_quattro_Ur-quattro.jpg/1280px-Audi_quattro_Ur-quattro.jpg','[]',8),
('R8 V10',      'r8-v10',      2009,'Gen 1','Sports Car','5.2L V10',            525, '530 Nm','Automatic 6-R-tronic','AWD','Gasoline',317,  3.9,1620, 115000.00,
 'Audi''s mid-engine supercar shares Lamborghini Gallardo''s V10 for a raw driving experience.',
 NULL,'[]',8),
('RS6 Avant',   'rs6-avant',   2021,'C8',  'Estate',   '4.0L Biturbo V8',     600, '800 Nm','Automatic 8-spd','AWD','Gasoline',305,  3.6,2075, 115000.00,
 'The ultimate family car: a practical estate with 600 hp, usable daily.',
 NULL,'[]',8),
('A8',          'a8',          2018,'D5',  'Sedan',    '3.0L V6 Turbo',        340, '500 Nm','Automatic 8-spd','AWD','Gasoline',250,  5.7,2085,  84900.00,
 'Audi''s flagship luxury saloon with Level 3 autonomous capability and air suspension.',
 NULL,'[]',8),
('TT RS',       'tt-rs',       2017,'8S',  'Coupe',    '2.5L Turbo I5',        400, '480 Nm','Automatic 7-spd','AWD','Gasoline',250,  3.7,1450,  62000.00,
 'The five-cylinder TT RS revives Quattro heritage; 400 hp in a compact, focused package.',
 NULL,'[]',8),
('e-tron GT',   'e-tron-gt',   2021,'J1',  'Sports Car','Electric Dual Motor',  476, '630 Nm','Automatic 2-spd','AWD','Electric',245,  4.1,2340,  99900.00,
 'Audi''s luxury electric GT based on the Taycan platform, with 630 hp in RS spec.',
 NULL,'[]',8),
('RS3',         'rs3',         2022,'8Y',  'Sedan',    '2.5L Turbo I5',        400, '500 Nm','Automatic 7-spd','AWD','Gasoline',290,  3.8,1530,  59900.00,
 'Compact five-pot RS car; torque-vectoring rear axle and 400 hp from just 2.5 litres.',
 NULL,'[]',8),

-- ── Toyota (9) ───────────────────────────────────────────────────────────────
('Corolla AE86', 'corolla-ae86',1983,'E80',  'Coupe',    '1.6L I4',             128, '150 Nm','Manual 5-speed', 'RWD','Gasoline',185,  8.5, 940,  8500.00,
 'The legendary Hachi-roku; lightweight RWD coupe immortalised by Initial D and motorsport.',
 NULL,'[]',9),
('Supra A80',    'supra-a80',   1993,'A80',  'Sports Car','3.0L Twin-Turbo I6', 330, '440 Nm','Manual 6-speed', 'RWD','Gasoline',285,  5.1,1570, 39000.00,
 'The twin-turbo 2JZ engine made the A80 Supra a tuning legend with massive power potential.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Toyota_Supra_A80_–_vorderansicht_%281%29.jpg/1280px-Toyota_Supra_A80_–_vorderansicht_%281%29.jpg','[]',9),
('Land Cruiser FJ40','land-cruiser-fj40',1972,'FJ40','SUV','4.2L I6',            125, '255 Nm','Manual 4-speed', '4WD','Gasoline',130,  NULL,1820,  4300.00,
 'The FJ40 established Toyota''s reputation for indestructible off-road capability globally.',
 NULL,'[]',9),
('Prius',        'prius',       1997,'Gen 1','Sedan',    '1.5L I4 + Electric',   99,  '102 Nm','CVT',            'FWD','Hybrid',  160, 10.9,1254, 23000.00,
 'The world''s first mass-produced hybrid car; launched the era of mainstream electrification.',
 NULL,'[]',9),
('GR86',         'gr86',        2022,'Gen 2','Coupe',    '2.4L I4',             234, '250 Nm','Manual 6-speed', 'RWD','Gasoline',226,  6.3,1275, 27700.00,
 'The second-generation 86 with a larger flat-four engine; pure analogue sports car enjoyment.',
 NULL,'[]',9),
('GR Supra',     'gr-supra',    2020,'Gen 5','Sports Car','3.0L Turbo I6',       382, '500 Nm','Automatic 8-spd','RWD','Gasoline',250,  4.3,1540, 43500.00,
 'Fifth-generation Supra developed jointly with BMW; shares the Z4''s turbocharged inline-six.',
 NULL,'[]',9),
('Hilux',        'hilux',       2021,'Gen 8','Truck',    '2.8L Turbo Diesel I4',204, '500 Nm','Automatic 6-spd','4WD','Diesel',  175,  9.9,1925, 30000.00,
 'The world''s most reliable pickup truck; a global icon of durability in any terrain.',
 NULL,'[]',9),
('Celica',       'celica',      1985,'Gen 4','Coupe',    '2.0L I4',             145, '178 Nm','Manual 5-speed', 'FWD','Gasoline',200,  8.5,1060, 12000.00,
 'Japan''s popular sports coupe; WRC victories secured its motorsport legacy through the 1990s.',
 NULL,'[]',9),

-- ── Honda (10) ───────────────────────────────────────────────────────────────
('NSX',            'nsx',           1991,'NA1','Sports Car','3.0L V6',           270, '284 Nm','Manual 5-speed', 'RWD','Gasoline',270,  5.7,1370, 60000.00,
 'The original NSX showed the world that a supercar could be reliable and daily driveable.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/1991_Honda_NSX_NA1_001.jpg/1280px-1991_Honda_NSX_NA1_001.jpg','[]',10),
('NSX',            'nsx',           2017,'NC1','Sports Car','3.5L Twin-Turbo V6 + 3 E-Motors',573,'645 Nm','Automatic 9-DCT','AWD','Hybrid',307,  3.0,1725,157800.00,
 'The hybrid successor uses three electric motors plus a twin-turbo V6 and SH-AWD system.',
 NULL,'[]',10),
('Civic Type R',   'civic-type-r',  2023,'FL5','Hatchback','2.0L Turbo I4',     315, '420 Nm','Manual 6-speed', 'FWD','Gasoline',282,  5.4,1432, 42895.00,
 'The most focused Civic yet; FWD record holder at multiple circuits worldwide.',
 NULL,'[]',10),
('S2000',          's2000',         2000,'AP1','Convertible','2.0L VTEC I4',     237, '208 Nm','Manual 6-speed', 'RWD','Gasoline',240,  6.2,1252, 32000.00,
 'A rev-happy 9000 rpm naturally aspirated engine in a lightweight rear-drive roadster.',
 NULL,'[]',10),
('Integra Type R',  'integra-type-r',1998,'DC2','Coupe',    '1.8L VTEC I4',     197, '181 Nm','Manual 5-speed', 'FWD','Gasoline',235,  7.8,1094, 22000.00,
 'The B18C-powered Type R is still regarded as one of the greatest front-wheel drive cars.',
 NULL,'[]',10),
('CR-V',           'cr-v',          2022,'Gen 6','SUV',     '1.5L Turbo I4',    192, '243 Nm','CVT',            'AWD','Gasoline',195,  7.8,1670, 29400.00,
 'Honda''s best-selling global SUV, combining practicality with efficient performance.',
 NULL,'[]',10),
('Accord',         'accord',        2023,'Gen 11','Sedan',  '1.5L Turbo I4',    192, '260 Nm','CVT',            'FWD','Gasoline',200,  7.5,1530, 28845.00,
 'The eleventh Accord continues its reputation as the definitive mid-size sports saloon.',
 NULL,'[]',10),

-- ── Nissan (11) ──────────────────────────────────────────────────────────────
('GT-R R35',       'gt-r-r35',       2007,'R35','Sports Car','3.8L Twin-Turbo V6',480,'588 Nm','Automatic 6-DCT','AWD','Gasoline',315,  3.5,1736, 100000.00,
 'Godzilla reborn: twin-turbo VR38 and ATTESA AWD set a new benchmark in supercar value.',
 NULL,'[]',11),
('Skyline GT-R R34','skyline-gt-r-r34',1999,'R34','Sports Car','2.6L Twin-Turbo I6',276,'372 Nm','Manual 6-speed','AWD','Gasoline',250,  4.9,1540,  35000.00,
 'The last pure Skyline GT-R; RB26DETT engine and ATTESA AWD made it a legend.',
 NULL,'[]',11),
('370Z',           '370z',           2009,'Z34','Sports Car','3.7L V6',           332,'363 Nm','Manual 6-speed', 'RWD','Gasoline',250,  5.2,1496,  30000.00,
 'Keeping the Z-car spirit alive with a high-revving VQ37 naturally aspirated V6.',
 NULL,'[]',11),
('Leaf',           'leaf',           2011,'Gen 1','Hatchback','Electric Motor',   109, '254 Nm','Single-speed',  'FWD','Electric',150,  11.5,1521,  28800.00,
 'The world''s first mass-market pure electric vehicle; pioneered mainstream EV adoption.',
 NULL,'[]',11),
('Z',              'z',              2023,'RZ34','Sports Car','3.0L Twin-Turbo V6',400,'481 Nm','Manual 6-speed', 'RWD','Gasoline',250,  4.5,1497,  41015.00,
 'The spiritual successor retains the twin-turbo V6 and long-nose, short-tail proportions.',
 NULL,'[]',11),
('Patrol',         'patrol',         2022,'Y62','SUV',       '5.6L V8',           400,'560 Nm','Automatic 7-spd','4WD','Gasoline',210,  6.0,2855,  72000.00,
 'Nissan''s flagship body-on-frame SUV; legendary off-road prowess since the 1950s.',
 NULL,'[]',11),
('Silvia S15',     'silvia-s15',     1999,'S15','Coupe',     '2.0L Turbo I4',    250, '275 Nm','Manual 6-speed', 'RWD','Gasoline',250,  5.6,1240,  28000.00,
 'The final Silvia generation; a drift icon with the powerful SR20DET engine.',
 NULL,'[]',11),

-- ── Mazda (12) ───────────────────────────────────────────────────────────────
('RX-7 FD',  'rx-7-fd', 1991,'FD3S','Sports Car','1.3L Twin-Rotor Wankel',255,'294 Nm','Manual 5-speed', 'RWD','Gasoline',255,  5.3,1260, 32000.00,
 'The sequential twin-turbo rotary FD is Mazda''s purest sports car expression.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Mazda_RX-7_FD3S_Spirit_R.jpg/1280px-Mazda_RX-7_FD3S_Spirit_R.jpg','[]',12),
('MX-5 NA',  'mx-5-na', 1990,'NA', 'Convertible','1.6L I4',            116,'136 Nm','Manual 5-speed', 'RWD','Gasoline',185,  8.6, 950, 13800.00,
 'Revived the affordable lightweight roadster; became the world''s best-selling sports car.',
 NULL,'[]',12),
('MX-5 ND',  'mx-5-nd', 2016,'ND', 'Convertible','2.0L I4',            184,'205 Nm','Manual 6-speed', 'RWD','Gasoline',214,  6.5,1000, 24900.00,
 'Fourth-generation MX-5 doubles down on lightness and driver engagement.',
 NULL,'[]',12),
('RX-8',     'rx-8',    2003,'SE3P','Sports Car','1.3L Naturally Aspirated Rotary',231,'216 Nm','Manual 6-speed','RWD','Gasoline',230,  6.4,1310, 26000.00,
 'Four-seat rotary coupe with Freestyle rear doors and the high-revving Renesis engine.',
 NULL,'[]',12),
('3',        '3',       2023,'BP', 'Sedan',      '2.5L I4',             191,'261 Nm','Automatic 6-spd','AWD','Gasoline',200,  8.2,1455, 23950.00,
 'Mazda''s core model elevated to near-premium territory with SKYACTIV technology.',
 NULL,'[]',12),
('CX-5',     'cx-5',    2022,'KF', 'SUV',        '2.5L Turbo I4',       256,'420 Nm','Automatic 6-spd','AWD','Gasoline',210,  5.7,1742, 27950.00,
 'The CX-5 Turbo brings punch to the stylish crossover with confident on-road dynamics.',
 NULL,'[]',12),

-- ── Ferrari (13) ─────────────────────────────────────────────────────────────
('250 GTO',        '250-gto',        1962,'Series 1','Sports Car','3.0L V12',        302,'290 Nm','Manual 5-speed', 'RWD','Gasoline',280,  6.1,880,  NULL,
 'The most valuable car in the world; homologation racer that dominated GT racing 1962–1964.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Ferrari_250_GTO_Goodwood_Festival_of_Speed_2013.jpg/1280px-Ferrari_250_GTO_Goodwood_Festival_of_Speed_2013.jpg','[]',13),
('F40',            'f40',            1987,'F40',    'Sports Car','2.9L Twin-Turbo V8',478,'577 Nm','Manual 5-speed', 'RWD','Gasoline',324,  4.1,1100,400000.00,
 'Enzo Ferrari''s final approved car; a raw, uncompromising twin-turbo supercar.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Ferrari_F40_–_Flickr_–_exfordy.jpg/1280px-Ferrari_F40_–_Flickr_–_exfordy.jpg','[]',13),
('Enzo',           'enzo',           2002,'Enzo',   'Sports Car','6.0L V12',         660,'657 Nm','Automatic 6-spd','RWD','Gasoline',355,  3.6,1365,660000.00,
 'Named after the founder; a Formula One-inspired hypercar limited to 400 examples.',
 NULL,'[]',13),
('LaFerrari',      'laferrari',      2013,'F150',   'Sports Car','6.3L V12 + KERS Motor',963,'900 Nm','Automatic 7-DCT','RWD','Hybrid',350,  2.9,1255,1400000.00,
 'Ferrari''s first series production hybrid; the KERS system adds electric boost on demand.',
 NULL,'[]',13),
('488 GTB',        '488-gtb',        2015,'F142',   'Sports Car','3.9L Twin-Turbo V8',660,'760 Nm','Automatic 7-DCT','RWD','Gasoline',330,  3.0,1370,252000.00,
 'The turbocharged successor to the 458 raised the bar for mid-engine Ferrari performance.',
 NULL,'[]',13),
('SF90 Stradale',  'sf90-stradale',  2019,'F173',   'Sports Car','4.0L Twin-Turbo V8 + 3 E-Motors',1000,'800 Nm','Automatic 8-DCT','AWD','Hybrid',340,  2.5,1570,507000.00,
 'Ferrari''s most powerful road car; 1000 hp from V8 and three electric motors.',
 NULL,'[]',13),
('296 GTB',        '296-gtb',        2022,'F171',   'Sports Car','3.0L Twin-Turbo V6 + E-Motor',830,'740 Nm','Automatic 8-DCT','RWD','Hybrid',330,  2.9,1470,322000.00,
 'Ferrari''s first V6 road car; plug-in hybrid system delivers Berlinetta performance.',
 NULL,'[]',13),
('Testarossa',     'testarossa',     1984,'F110',   'Sports Car','4.9L Flat-12',     390,'490 Nm','Manual 5-speed', 'RWD','Gasoline',290,  5.8,1660, 87000.00,
 'Iconic 1980s Ferrari with wide side strakes; the definitive poster car of a generation.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Ferrari_Testarossa.jpg/1280px-Ferrari_Testarossa.jpg','[]',13),

-- ── Lamborghini (14) ─────────────────────────────────────────────────────────
('Miura',              'miura',              1966,'P400',  'Sports Car','3.9L V12',          370,'386 Nm','Manual 5-speed', 'RWD','Gasoline',280,  6.7,980,   NULL,
 'The world''s first true supercar: mid-engine, gorgeous Bertone body, transverse V12.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Lamborghini_Miura_-_Geneva_Motor_Show_2015.jpg/1280px-Lamborghini_Miura_-_Geneva_Motor_Show_2015.jpg','[]',14),
('Countach',           'countach',           1974,'LP400', 'Sports Car','3.9L V12',          375,'362 Nm','Manual 5-speed', 'RWD','Gasoline',300,  5.6,1065,  NULL,
 'Bertone''s wedge-shaped icon that defined every 1970s child''s idea of a supercar.',
 NULL,'[]',14),
('Diablo VT',          'diablo-vt',          1993,'Diablo','Sports Car','5.7L V12',          530,'600 Nm','Manual 5-speed', 'AWD','Gasoline',325,  4.1,1576,   NULL,
 'The VT introduced viscous-coupling AWD to the Diablo, taming its monstrous power.',
 NULL,'[]',14),
('Murcielago LP 640',  'murcielago-lp-640',  2006,'LP640','Sports Car','6.5L V12',          640,'660 Nm','Manual 6-speed', 'AWD','Gasoline',340,  3.4,1665,354000.00,
 'The LP640 pushed the Murciélago to its ultimate form with a 6.5-litre naturally aspirated V12.',
 NULL,'[]',14),
('Aventador SVJ',      'aventador-svj',      2018,'LP770','Sports Car','6.5L V12',          770,'720 Nm','Automatic 7-ISR','AWD','Gasoline',350,  2.8,1525,517770.00,
 'Nürburgring lap record holder; the last Aventador variant with active aerodynamics.',
 NULL,'[]',14),
('Huracan Performante', 'huracan-performante',2018,'LP640','Sports Car','5.2L V10',         640,'600 Nm','Automatic 7-DCT','AWD','Gasoline',325,  2.9,1382,274390.00,
 'ALA active aero and forged composite body made the Performante a Nürburgring record-breaker.',
 NULL,'[]',14),
('Urus',               'urus',               2018,'S1',   'SUV',        '4.0L Twin-Turbo V8',650,'850 Nm','Automatic 8-spd','AWD','Gasoline',305,  3.6,2197,218009.00,
 'The first Lamborghini SUV since the LM002; fastest SUV in the world at its launch.',
 NULL,'[]',14),

-- ── Fiat (15) ────────────────────────────────────────────────────────────────
('500',          '500',          1957,'Gen 1','City Car',  '0.5L I2',          13,  '31 Nm','Manual 4-speed', 'RWD','Gasoline', 85,  NULL, 470,   465.00,
 'Italy''s beloved city car; iconic post-war mobility symbol that is still produced today.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Fiat_500_bianco.jpg/1280px-Fiat_500_bianco.jpg','[]',15),
('500',          '500',          2007,'Gen 2','City Car',  '1.2L I4',          69, '102 Nm','Manual 5-speed', 'FWD','Gasoline',155,  12.5, 865,  12300.00,
 'The retro-modern revival of the 500 became one of Europe''s most loved city cars.',
 NULL,'[]',15),
('124 Spider',   '124-spider',   1966,'Series 1','Convertible','1.4L I4',    90, '120 Nm','Manual 4-speed', 'RWD','Gasoline',170,  NULL, 910,   2530.00,
 'Classic open-top Italian roadster co-developed with Pininfarina; a motorsport winner.',
 NULL,'[]',15),
('Multipla',     'multipla',     1999,'Gen 1','MPV',       '1.6L I4',         100, '137 Nm','Manual 5-speed', 'FWD','Gasoline',166,  10.8,1200, 13000.00,
 'Controversial six-seat MPV with a split-level dashboard; voted ugliest car ever but loved inside.',
 NULL,'[]',15),
('Abarth 595',   'abarth-595',   2022,'Series 3','Hatchback','1.4L Turbo I4',165, '250 Nm','Manual 5-speed', 'FWD','Gasoline',218,  7.3, 1000, 24995.00,
 'The hot version of the 500 with Abarth tuning; tiny, loud, and tremendously fun.',
 NULL,'[]',15),

-- ── Alfa Romeo (16) ──────────────────────────────────────────────────────────
('Giulia Spider',      'giulia-spider',      1962,'101',   'Convertible','1.3L I4',          80, '103 Nm','Manual 5-speed', 'RWD','Gasoline',165,  NULL, 855,  NULL,
 'Elegant Pininfarina-designed roadster launched the Giulia series that defined Alfa style.',
 NULL,'[]',16),
('8C Competizione',    '8c-competizione',    2007,'920',   'Sports Car', '4.7L V8',          450, '470 Nm','Automatic 6-spd','RWD','Gasoline',292,  4.2,1585,200000.00,
 'A modern V8 sports car with Maserati-derived engine; only 500 coupes and 500 spiders built.',
 NULL,'[]',16),
('Giulia Quadrifoglio','giulia-quadrifoglio',2016,'952',   'Sedan',      '2.9L Twin-Turbo V6',510,'600 Nm','Automatic 8-spd','RWD','Gasoline',307,  3.9,1580, 79995.00,
 'Nürburgring record holder for production saloons; Ferrari-derived twin-turbo V6.',
 NULL,'[]',16),
('Stelvio Quadrifoglio','stelvio-quadrifoglio',2017,'949','SUV',        '2.9L Twin-Turbo V6',510,'600 Nm','Automatic 8-spd','AWD','Gasoline',284,  3.8,1830, 84995.00,
 'The world''s fastest production SUV at its launch; shares the Giulia QV''s platform.',
 NULL,'[]',16),
('Tonale',             'tonale',             2022,'965',   'SUV',        '1.5L Turbo I4 + Motor',280,'400 Nm','Automatic 6-spd','FWD','Hybrid',206,  6.2,1616, 39900.00,
 'Alfa''s first plug-in hybrid compact SUV; bridges Italian style with modern efficiency.',
 NULL,'[]',16),

-- ── Rolls-Royce (17) ─────────────────────────────────────────────────────────
('Silver Ghost',  'silver-ghost',  1906,'40/50 HP','Saloon',     '7.0L I6',        48, '305 Nm','Manual 4-speed', 'RWD','Gasoline', 80,  NULL,1600,   NULL,
 'The best car in the world by reputation; set records for reliability on a 1907 trial run.',
 NULL,'[]',17),
('Silver Shadow', 'silver-shadow', 1965,'SY',     'Saloon',     '6.75L V8',       172, '407 Nm','Automatic 3-spd','RWD','Gasoline',190,  10.9,2200,  7000.00,
 'Revolutionary monocoque construction replaced the traditional chassis for 1965.',
 NULL,'[]',17),
('Phantom VII',   'phantom-vii',   2003,'VII',    'Saloon',     '6.75L V12',      453, '720 Nm','Automatic 6-spd','RWD','Gasoline',240,  5.9,2760,320000.00,
 'BMW-owned Rolls-Royce''s first new Phantom; aluminium space-frame and hand-built interior.',
 NULL,'[]',17),
('Phantom VIII',  'phantom-viii',  2017,'VIII',   'Saloon',     '6.75L Twin-Turbo V12',563,'900 Nm','Automatic 8-spd','RWD','Gasoline',250,  5.3,2770,455000.00,
 'The eighth Phantom elevates luxury with a gallery dash and silent waftability.',
 NULL,'[]',17),
('Ghost',         'ghost',         2021,'RR31',   'Saloon',     '6.75L Twin-Turbo V12',563,'900 Nm','Automatic 8-spd','AWD','Gasoline',250,  4.8,2490,332500.00,
 'Post Opulence Ghost uses all-wheel drive and all-wheel steering for effortless composure.',
 NULL,'[]',17),
('Cullinan',      'cullinan',      2018,'RR31',   'SUV',        '6.75L Twin-Turbo V12',563,'850 Nm','Automatic 8-spd','AWD','Gasoline',250,  4.9,2660,330000.00,
 'The first Rolls-Royce SUV; named after the world''s largest gem-quality rough diamond.',
 NULL,'[]',17),
('Spectre',       'spectre',       2023,'RR41',   'Coupe',      'Electric Dual Motor',577,'900 Nm','Single-speed',  'AWD','Electric',250,  4.5,2890,413000.00,
 'Rolls-Royce''s first fully electric car; the Spectre marks the brand''s EV transition.',
 NULL,'[]',17),

-- ── Bentley (18) ─────────────────────────────────────────────────────────────
('Continental R',       'continental-r',       1952,'R-Type','Coupe',    '4.6L I6',          130,'305 Nm','Manual 4-speed', 'RWD','Gasoline',185,  NULL,1905,   NULL,
 'The R-Type Continental was the fastest closed car in the world when launched in 1952.',
 NULL,'[]',18),
('Continental GT',      'continental-gt',      2003,'Gen 1','Coupe',    '6.0L W12 Biturbo',  560,'650 Nm','Automatic 6-spd','AWD','Gasoline',318,  4.8,2400,154600.00,
 'The first Bentley on VW Group platform; twin-turbo W12 elevated the GT segment.',
 NULL,'[]',18),
('Continental GT Speed', 'continental-gt-speed',2022,'Gen 3','Coupe',   '6.0L W12 Biturbo',  659,'900 Nm','Automatic 8-DCT','AWD','Gasoline',335,  3.6,2244,274900.00,
 'The Speed variant is the purest GT with rear-biased AWD and sports exhaust.',
 NULL,'[]',18),
('Bentayga',            'bentayga',            2016,'Gen 1','SUV',      '6.0L W12 Biturbo',  608,'900 Nm','Automatic 8-spd','AWD','Gasoline',301,  4.0,2440,231825.00,
 'The fastest SUV in the world at launch; set a production SUV record at Pikes Peak.',
 NULL,'[]',18),
('Flying Spur',         'flying-spur',         2020,'Gen 3','Saloon',   '6.0L W12 Biturbo',  635,'900 Nm','Automatic 8-DCT','AWD','Gasoline',333,  3.8,2437,214600.00,
 'The third-generation Flying Spur rides on an all-new platform with 48V active chassis.',
 NULL,'[]',18),
('Mulsanne',            'mulsanne',            2010,'Gen 2','Saloon',   '6.75L Twin-Turbo V8',512,'1020 Nm','Automatic 8-spd','RWD','Gasoline',296,  4.9,2700,280000.00,
 'The flagship Mulsanne Speed features the most powerful version of Bentley''s legendary V8.',
 NULL,'[]',18),

-- ── Jaguar (19) ──────────────────────────────────────────────────────────────
('E-Type Series 1', 'e-type-series-1',1961,'Series 1','Sports Car','3.8L I6',        265,'325 Nm','Manual 4-speed', 'RWD','Gasoline',241,  6.9,1110,  2100.00,
 'Enzo Ferrari called it the most beautiful car ever made. Britain''s greatest sporting car.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Jaguar_E-type_Series_I_3.8_Roadster.jpg/1280px-Jaguar_E-type_Series_I_3.8_Roadster.jpg','[]',19),
('XJ220',           'xj220',          1992,'XJ220','Sports Car','3.5L Twin-Turbo V6',542,'644 Nm','Manual 5-speed', 'RWD','Gasoline',349,  3.8,1470,470000.00,
 'The XJ220 was the fastest production car in the world when launched in 1992.',
 NULL,'[]',19),
('XJR-15',          'xjr-15',         1990,'XJR-15','Sports Car','6.0L V12',         450,'550 Nm','Manual 5-speed', 'RWD','Gasoline',330,  3.9,1050,  NULL,
 'Group C racing heritage in a road car; carbon fibre body and Le Mans-proven V12.',
 NULL,'[]',19),
('F-Type R',        'f-type-r',       2020,'Gen 1','Sports Car','5.0L Supercharged V8',575,'700 Nm','Automatic 8-spd','AWD','Gasoline',300,  3.5,1665, 103000.00,
 'The F-Type R combines wailing supercharged V8 soundtrack with genuine sports car ability.',
 NULL,'[]',19),
('I-Pace',          'i-pace',         2018,'Gen 1','SUV',        'Electric Dual Motor',400,'696 Nm','Single-speed',  'AWD','Electric',200,  4.8,2208,  69900.00,
 'Jaguar''s first all-electric vehicle won World Car of the Year 2019.',
 NULL,'[]',19),
('XE SV Project 8', 'xe-sv-project-8',2018,'Gen 1','Sedan',      '5.0L Supercharged V8',600,'700 Nm','Automatic 8-spd','AWD','Gasoline',322,  3.3,1760,  188000.00,
 'Hand-built at SV Technical Centre; 300 cars built. Four-door Nürburgring record holder.',
 NULL,'[]',19),

-- ── Aston Martin (20) ────────────────────────────────────────────────────────
('DB5',            'db5',            1963,'DB5',       'GT',         '4.0L I6',        282,'390 Nm','Manual 4-speed', 'RWD','Gasoline',232,  8.1,1465,  NULL,
 'The most famous car in the world courtesy of James Bond. An icon of British elegance.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Aston_Martin_DB5.jpg/1280px-Aston_Martin_DB5.jpg','[]',20),
('DB9',            'db9',            2004,'DB9',       'GT',         '6.0L V12',       470,'570 Nm','Automatic 6-spd','RWD','Gasoline',300,  4.6,1710, 118000.00,
 'The DB9 marked Aston Martin''s VH platform era; all-aluminium construction and V12.',
 NULL,'[]',20),
('DBS Superleggera','dbs-superleggera',2018,'DBS',      'GT',         '5.2L Twin-Turbo V12',725,'900 Nm','Automatic 8-spd','RWD','Gasoline',340,  3.4,1693, 304000.00,
 'Superleggera means super-light; carbon body over the VH platform with AMG-derived twin-turbo.',
 NULL,'[]',20),
('Valkyrie',       'valkyrie',       2022,'AMR-22',    'Hypercar',   '6.5L V12 + KERS',1160,'740 Nm','Automatic 7-spd','RWD','Hybrid', 402,  2.5,1030,3000000.00,
 'A road-legal Formula One car co-developed with Red Bull Racing; downforce exceeds car weight.',
 NULL,'[]',20),
('Vantage',        'vantage',        2018,'Vantage',   'Sports Car', '4.0L Twin-Turbo V8',510,'685 Nm','Automatic 8-spd','RWD','Gasoline',314,  3.7,1530, 149995.00,
 'The fourth-generation Vantage uses Mercedes-AMG''s twin-turbo V8 in a lighter body.',
 NULL,'[]',20),
('DB11',           'db11',           2016,'DB11',      'GT',         '5.2L Twin-Turbo V12',608,'700 Nm','Automatic 8-spd','RWD','Gasoline',334,  3.7,1770, 197086.00,
 'First all-new Aston Martin in a decade; twin-turbo V12 with aeroblade ducting.',
 NULL,'[]',20),

-- ── Hyundai (21) ─────────────────────────────────────────────────────────────
('Pony',       'pony',       1975,'Gen 1','Sedan',    '1.2L I4',           80, '88 Nm','Manual 4-speed', 'RWD','Gasoline',142,  NULL,1060,   2500.00,
 'South Korea''s first domestically developed car; Giorgetto Giugiaro designed the body.',
 NULL,'[]',21),
('Sonata',     'sonata',     2020,'DN8', 'Sedan',    '2.5L I4',           191,'245 Nm','Automatic 8-spd','FWD','Gasoline',225,  7.4,1513,  24100.00,
 'The Sonata''s eighth generation earned wide acclaim for its distinctive fastback styling.',
 NULL,'[]',21),
('IONIQ 5',    'ioniq-5',    2021,'NE1', 'SUV',      'Electric Dual Motor',306,'605 Nm','Single-speed',  'AWD','Electric',185,  5.1,2100,  41450.00,
 'Retro-futurist EV on the E-GMP platform; ultra-fast 800V charging in 18 minutes.',
 NULL,'[]',21),
('i30 N',      'i30-n',      2021,'PD', 'Hatchback','2.0L Turbo I4',     280,'392 Nm','Manual 6-speed', 'FWD','Gasoline',250,  5.4,1451,  38000.00,
 'Hyundai''s N division hot hatch; developed on the Nürburgring with Volkswagen DNA.',
 NULL,'[]',21),
('Tucson',     'tucson',     2021,'NX4','SUV',       '1.6L Turbo I4',    230,'350 Nm','Automatic 7-DCT','AWD','Hybrid',  195,  8.0,1680,  29000.00,
 'The fourth-generation Tucson''s parametric design won international styling awards.',
 NULL,'[]',21),
('Veloster N', 'veloster-n', 2021,'JS', 'Hatchback','2.0L Turbo I4',     275,'392 Nm','Manual 6-speed', 'FWD','Gasoline',250,  5.5,1415,  33000.00,
 'Asymmetric three-door hatchback with a Nürburgring-tuned chassis and high-performance brakes.',
 NULL,'[]',21),

-- ── Kia (22) ─────────────────────────────────────────────────────────────────
('Stinger GT', 'stinger-gt', 2018,'CK', 'Sedan',    '3.3L Twin-Turbo V6',365,'510 Nm','Automatic 8-spd','AWD','Gasoline',270,  4.7,1805,  40000.00,
 'Kia''s rear-wheel-drive sports sedan shocked the industry with its performance credentials.',
 NULL,'[]',22),
('Telluride',  'telluride',  2020,'MN4','SUV',       '3.8L V6',           291,'355 Nm','Automatic 8-spd','AWD','Gasoline',193,  6.5,2008,  36990.00,
 'Kia''s three-row flagship SUV; 2020 World Car of the Year. A family hauler without compromise.',
 NULL,'[]',22),
('EV6 GT',     'ev6-gt',     2022,'CV', 'SUV',       'Electric Dual Motor',585,'740 Nm','Single-speed',  'AWD','Electric',260,  3.5,2060,  61600.00,
 'The most powerful Kia ever; 0–100 km/h in 3.5 s and 800V ultra-fast charging.',
 NULL,'[]',22),
('Sportage',   'sportage',   2023,'NQ5','SUV',       '1.6L Turbo I4',    180,'265 Nm','Automatic 7-DCT','AWD','Gasoline',185,  8.2,1625,  31295.00,
 'Fifth-generation Sportage features bold Opposite United design language and class-leading kit.',
 NULL,'[]',22),
('Carnival',   'carnival',   2022,'KA4','MPV',       '3.5L V6',           290,'355 Nm','Automatic 8-spd','FWD','Gasoline',195,  7.1,2041,  32900.00,
 'The Carnival minivan rebranded from Sedona; spacious, luxurious, and family-focused.',
 NULL,'[]',22),

-- ── Renault (23) ─────────────────────────────────────────────────────────────
('Alpine A110',  'alpine-a110', 1962,'Series 1','Sports Car','1.1L I4',           59, '78 Nm','Manual 4-speed', 'RWD','Gasoline',190,  NULL, 620,   NULL,
 'Lightweight mid-engine Alpine; won the 1973 Monte Carlo Rally on debut for Renault.',
 NULL,'[]',23),
('Clio V6',      'clio-v6',     2001,'Phase 1','Hatchback','3.0L V6',           230,'300 Nm','Manual 6-speed', 'RWD','Gasoline',235,  6.4,1390,  47000.00,
 'A mid-engine hot hatch; Renault Sport replaced the rear seats with a 3-litre V6.',
 NULL,'[]',23),
('Megane RS',    'megane-rs',   2018,'IV',    'Hatchback','1.8L Turbo I4',     280,'390 Nm','Manual 6-speed', 'FWD','Gasoline',250,  5.8,1430,  36700.00,
 'Nürburgring front-wheel drive record holder with 4WS rear-axle steering.',
 NULL,'[]',23),
('5 Turbo',      '5-turbo',     1980,'Phase 1','Hatchback','1.4L Turbo I4',     160,'220 Nm','Manual 5-speed', 'RWD','Gasoline',200,  6.9,1000,  NULL,
 'Mid-engine supermini; replaced the rear seats with a turbocharged engine for rally use.',
 NULL,'[]',23),
('Zoe',          'zoe',         2013,'Gen 1','Hatchback','Electric Motor',      88, '220 Nm','Single-speed',  'FWD','Electric',135, 11.4,1468,  22000.00,
 'Renault''s pioneering electric city car; the best-selling EV in Europe for several years.',
 NULL,'[]',23),
('Espace',       'espace',      2023,'Gen 5','SUV',      '1.2L Turbo I3',      131,'230 Nm','Automatic 7-DCT','FWD','Gasoline',195, 10.8,1598,  42000.00,
 'The Espace reinvents itself as a seven-seat SUV for its fifth generation.',
 NULL,'[]',23),

-- ── Peugeot (24) ─────────────────────────────────────────────────────────────
('205 GTI',       '205-gti',     1984,'Gen 1','Hatchback','1.6L I4',          105,'134 Nm','Manual 5-speed', 'FWD','Gasoline',190, 8.5,  870,   9000.00,
 'The car that defined the hot hatch; a driver''s car that is still cherished 40 years on.',
 NULL,'[]',24),
('306 GTI-6',     '306-gti-6',   1997,'Gen 1','Hatchback','2.0L I4',          167,'190 Nm','Manual 6-speed', 'FWD','Gasoline',228, 7.3, 1100,  18000.00,
 'Richard Burns and Sébastien Loeb drove Peugeot to WRC glory in the 306 era.',
 NULL,'[]',24),
('508 PSE',       '508-pse',     2021,'Gen 2','Sedan',    '1.6L Turbo I4 + 2 E-Motors',360,'520 Nm','Automatic 8-spd','AWD','Hybrid',250, 5.2, 1880,  65000.00,
 'Peugeot Sport Engineered: the hottest 508 uses a plug-in hybrid powertrain.',
 NULL,'[]',24),
('3008',          '3008',        2022,'Gen 2','SUV',      '1.6L Turbo I4',    225,'360 Nm','Automatic 8-spd','AWD','Gasoline',210, 8.0, 1700,  43000.00,
 'The 3008 Hybrid4 SUV won European Car of the Year 2017 in its first generation.',
 NULL,'[]',24),
('208',           '208',         2020,'Gen 2','Hatchback','1.2L PureTech I3', 130,'230 Nm','Automatic 8-spd','FWD','Gasoline',205, 8.0, 1200,  22000.00,
 'The 208 won European Car of the Year 2020; available as EV, petrol, or diesel.',
 NULL,'[]',24),

-- ── Citroën (25) ─────────────────────────────────────────────────────────────
('DS',          'ds',           1955,'DS19','Saloon',     '1.9L I4',           75,  '124 Nm','Manual 4-speed', 'FWD','Gasoline',160,  NULL,1320,  NULL,
 'Revolutionary hydropneumatic suspension and aerodynamic body changed automotive design.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Citroën_DS_23_Pallas.jpg/1280px-Citroën_DS_23_Pallas.jpg','[]',25),
('2CV',         '2cv',          1948,'A',  'City Car',  '0.4L I2',            12,  '20 Nm','Manual 4-speed', 'FWD','Gasoline', 65,  NULL, 560,  NULL,
 'The umbrella on four wheels; minimalist French motoring legend produced for 42 years.',
 NULL,'[]',25),
('SM',          'sm',           1970,'SM', 'GT',         '2.7L V6',           170, '232 Nm','Manual 5-speed', 'FWD','Gasoline',220,  8.5,1453,  NULL,
 'Citroën''s grand tourer used a Maserati V6 engine and the famous hydropneumatic suspension.',
 NULL,'[]',25),
('Xantia Activa','xantia-activa',1997,'X2','Sedan',      '2.0L I4',           136,'185 Nm','Manual 5-speed', 'FWD','Gasoline',210,  9.0,1295,  NULL,
 'The Xantia Activa''s active roll suppression set a world record for skidpad lateral g-force.',
 NULL,'[]',25),
('C5 X',        'c5-x',         2022,'C5 X','SUV',       '1.6L Turbo I4 + Motor',225,'360 Nm','Automatic 8-spd','AWD','Hybrid',220,  7.5,1850,  38000.00,
 'Citroën''s flagship plug-in hybrid saloon-SUV crossover with magic carpet ride.',
 NULL,'[]',25),

-- ── Bugatti (26) ─────────────────────────────────────────────────────────────
('Type 35',           'type-35',            1924,'Type 35', 'Racing Car','2.0L I8',        128,  '157 Nm','Manual 4-speed', 'RWD','Gasoline',200,  NULL, 750,  NULL,
 'The most successful racing car in history with over 1000 race victories in its era.',
 NULL,'[]',26),
('Veyron 16.4',       'veyron-16-4',        2005,'16.4',    'Sports Car','8.0L Quad-Turbo W16',1001,'1250 Nm','Automatic 7-DSG','AWD','Gasoline',407, 2.5,1888,1700000.00,
 'Broke the 400 km/h barrier for a production car; the engineering tour de force of its era.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Bugatti_Veyron_16.4.jpg/1280px-Bugatti_Veyron_16.4.jpg','[]',26),
('Chiron',            'chiron',             2016,'Type 218','Sports Car','8.0L Quad-Turbo W16',1500,'1600 Nm','Automatic 7-DSG','AWD','Gasoline',420, 2.4,1996,3200000.00,
 'Successor to the Veyron; 1500 hp quad-turbo W16 capped at 420 km/h for safety.',
 NULL,'[]',26),
('Chiron Super Sport 300+','chiron-super-sport-300',2019,'300+','Sports Car','8.0L Quad-Turbo W16',1600,'1600 Nm','Automatic 7-DSG','AWD','Gasoline',490, 2.4,2000,3900000.00,
 'First production car to exceed 300 mph (482 km/h); only 30 examples built.',
 NULL,'[]',26),
('Bolide',            'bolide',             2024,'Bolide',   'Track Car',  '8.0L Quad-Turbo W16',1825,'1850 Nm','Automatic 7-DSG','AWD','Gasoline',500, 2.2,1450,4700000.00,
 'A 1825 hp track-only hypercar; lightweight carbon structure around the iconic W16.',
 NULL,'[]',26),

-- ── Volvo Cars (27) ──────────────────────────────────────────────────────────
('P1800',       'p1800',        1961,'P1800',  'Sports Car','1.8L I4',       100, '143 Nm','Manual 4-speed', 'RWD','Gasoline',175,  NULL,1150,  NULL,
 'A rare Swedish sports car; one served as the Saint''s car and clocked 3 million miles.',
 NULL,'[]',27),
('240',         '240',          1974,'Gen 1',  'Sedan',    '2.0L I4',        97, '158 Nm','Manual 4-speed', 'RWD','Gasoline',165,  NULL,1200,  7000.00,
 'The boxy 240 became synonymous with safety and Scandinavian practicality.',
 NULL,'[]',27),
('850 T5-R',    '850-t5-r',     1995,'Gen 1',  'Estate',   '2.3L Turbo I5', 240,'340 Nm','Manual 5-speed', 'FWD','Gasoline',250,  6.5,1456,  32000.00,
 'Volvo''s surprise BTCC entrant with a turbocharged five-cylinder in a family estate.',
 NULL,'[]',27),
('XC90',        'xc90',         2016,'Gen 2',  'SUV',      '2.0L Supercharged & Turbo I4',320,'640 Nm','Automatic 8-spd','AWD','Hybrid',220,  5.6,2167,  80000.00,
 'XC90 T8 Excellence combines plug-in hybrid power with class-leading Scandinavian luxury.',
 NULL,'[]',27),
('XC60',        'xc60',         2022,'Gen 2',  'SUV',      '2.0L Turbo I4', 250,'350 Nm','Automatic 8-spd','AWD','Gasoline',210,  6.7,1893,  50000.00,
 'Voted World Car of the Year 2018; the XC60 balances safety, style, and dynamics.',
 NULL,'[]',27),
('C40 Recharge', 'c40-recharge',2022,'Gen 1',  'SUV',      'Electric Dual Motor',408,'660 Nm','Single-speed',  'AWD','Electric',180,  4.7,2058,  55000.00,
 'Volvo''s first coupé-SUV is electric-only; commitment to carbon neutrality by 2040.',
 NULL,'[]',27),

-- ── Koenigsegg (28) ──────────────────────────────────────────────────────────
('CCX',        'ccx',        2006,'CCX',    'Sports Car','4.7L Supercharged V8',806,'678 Nm','Manual 6-speed', 'RWD','Gasoline',395,  3.2, 1180,  600000.00,
 'The CCX was designed to meet US emissions regulations; Koenigsegg''s global debut car.',
 NULL,'[]',28),
('Agera RS',   'agera-rs',   2015,'Agera',  'Sports Car','5.0L Twin-Turbo V8', 1160,'1280 Nm','Manual 7-speed','RWD','Gasoline',458,  2.6,1395, 2500000.00,
 'Set five world speed records in 2017; top speed of 457 km/h on a Nevada highway.',
 NULL,'[]',28),
('Jesko',      'jesko',      2020,'Jesko',  'Sports Car','5.0L Twin-Turbo V8', 1600,'1500 Nm','Automatic 9-spd','RWD','Gasoline',480,  2.5,1420, 2800000.00,
 'The Jesko Absolut targets 330 mph/531 km/h; revolutionary Light Speed Transmission.',
 NULL,'[]',28),
('Regera',     'regera',     2015,'Regera', 'Sports Car','5.0L Twin-Turbo V8 + 3 E-Motors',1500,'2000 Nm','Single-speed','RWD','Hybrid',410, 2.7,1628, 1900000.00,
 'A mega hybrid with 2000 Nm of torque; no traditional gearbox – just pure electric torque fill.',
 NULL,'[]',28),

-- ── Tata Motors (29) ─────────────────────────────────────────────────────────
('Nano',        'nano',        2008,'Gen 1','City Car',  '0.6L I2',           38,  '51 Nm','Manual 4-speed', 'RWD','Gasoline',105, 14.0, 600,  2500.00,
 'The world''s cheapest production car; Ratan Tata''s vision of affordable family mobility.',
 NULL,'[]',29),
('Nexon EV',    'nexon-ev',    2019,'Gen 1','SUV',       'Electric Motor',    129, '245 Nm','Single-speed',  'FWD','Electric', 120,  9.9,1396, 14000.00,
 'India''s best-selling electric vehicle; affordable EV mobility for a developing market.',
 NULL,'[]',29),
('Harrier',     'harrier',     2019,'Gen 1','SUV',       '2.0L Turbo Diesel I4',170,'350 Nm','Automatic 6-spd','FWD','Diesel', 182,  9.5,1720, 20000.00,
 'Tata''s premium SUV based on Land Rover D8 platform; best-in-class build quality.',
 NULL,'[]',29),
('Tiago EV',    'tiago-ev',    2022,'Gen 1','City Car',  'Electric Motor',     74, '114 Nm','Single-speed',  'FWD','Electric', 150, 11.5,1135,  8500.00,
 'India''s most affordable electric car makes EV ownership accessible to mass market.',
 NULL,'[]',29),

-- ── Mahindra (30) ────────────────────────────────────────────────────────────
('Thar',       'thar',       2020,'Gen 2','SUV',       '2.2L Turbo Diesel I4',130,'300 Nm','Automatic 6-spd','4WD','Diesel', 155,  12.0,1750,  14000.00,
 'Mahindra''s iconic off-roader reborn with modern safety, style, and off-road hardware.',
 NULL,'[]',30),
('Scorpio-N',  'scorpio-n',  2022,'Gen 3','SUV',       '2.2L Turbo Diesel I4',175,'400 Nm','Automatic 6-spd','4WD','Diesel', 190,  9.5,2025,  16000.00,
 'The third-generation Scorpio-N introduced monocoque construction to the iconic nameplate.',
 NULL,'[]',30),
('XUV700',     'xuv700',     2021,'Gen 1','SUV',       '2.0L Turbo I4',     200,'380 Nm','Automatic 6-spd','AWD','Gasoline',200,  8.5,1800,  18000.00,
 'Mahindra''s flagship SUV with ADAS suite; the most feature-rich Indian-made car.',
 NULL,'[]',30),
('Bolero',     'bolero',     2000,'Gen 1','SUV',       '1.5L Turbo Diesel I4', 70,'195 Nm','Manual 5-speed', '4WD','Diesel', 130,  NULL,1540,   8000.00,
 'India''s best-selling utility vehicle for over two decades; simple, durable, practical.',
 NULL,'[]',30),

-- ── Škoda Auto (31) ──────────────────────────────────────────────────────────
('Octavia RS',  'octavia-rs',  2005,'Mk II',  'Hatchback','2.0L Turbo I4',    200,'280 Nm','Manual 6-speed', 'FWD','Gasoline',243,  7.3,1371,  25000.00,
 'The Octavia RS democratised hot hatch performance with VW Group engineering at Škoda prices.',
 NULL,'[]',31),
('Superb',      'superb',      2016,'Mk III', 'Sedan',    '2.0L Turbo I4',    220,'350 Nm','Automatic 7-DSG','AWD','Gasoline',250,  6.8,1568,  33000.00,
 'The Superb offers Audi-like interior quality and massive space at a lower price point.',
 NULL,'[]',31),
('Kodiaq',      'kodiaq',      2017,'Mk I',   'SUV',      '2.0L TDI Diesel',  150,'340 Nm','Automatic 7-DSG','AWD','Diesel', 205,  9.2,1726,  28000.00,
 'Škoda''s first seven-seat SUV on MQB platform; class-leading interior space.',
 NULL,'[]',31),
('Enyaq iV',    'enyaq-iv',    2021,'Gen 1',  'SUV',      'Electric Motor',   204,'310 Nm','Single-speed',  'RWD','Electric',160,  8.7,2025,  40000.00,
 'The Enyaq is Škoda''s first purpose-built electric car on VW''s MEB platform.',
 NULL,'[]',31),
('Fabia',       'fabia',       2022,'Mk IV',  'Hatchback','1.0L TSI I3',      110,'200 Nm','Manual 6-speed', 'FWD','Gasoline',195, 10.0, 1225,  18000.00,
 'The fourth Fabia grows on MQB-A0 platform; more space, more tech, sharper design.',
 NULL,'[]',31);

-- ── Car Colors ──────────────────────────────────────────────────────────────
-- Insert colors using slug+year subquery to avoid hardcoded IDs

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Brewster Green',    '#2F4F2F', id FROM cars WHERE slug='model-t'    AND year=1908;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Black',             '#0A0A0A', id FROM cars WHERE slug='model-t'    AND year=1908;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Midnight Blue',     '#00008B', id FROM cars WHERE slug='model-t'    AND year=1908;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Wimbledon White',   '#F5F5F5', id FROM cars WHERE slug='mustang'    AND year=1965;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Rangoon Red',       '#C41E3A', id FROM cars WHERE slug='mustang'    AND year=1965;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Midnight Blue',     '#191970', id FROM cars WHERE slug='mustang'    AND year=1965;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Poppy Red',         '#FF4D00', id FROM cars WHERE slug='mustang'    AND year=2024;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Ebon Black',        '#1C1C1C', id FROM cars WHERE slug='mustang'    AND year=2024;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Atlas Blue',        '#0F4C75', id FROM cars WHERE slug='mustang'    AND year=2024;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Gulf Blue',         '#0067B0', id FROM cars WHERE slug='gt40'       AND year=1966;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Gulf Orange',       '#FF8000', id FROM cars WHERE slug='gt40'       AND year=1966;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'British Racing Green','#004225',id FROM cars WHERE slug='gt40'       AND year=1966;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Race Red',          '#CC0000', id FROM cars WHERE slug='corvette-c8' AND year=2020;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Rapid Blue',        '#006BA6', id FROM cars WHERE slug='corvette-c8' AND year=2020;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Arctic White',      '#F0F0F0', id FROM cars WHERE slug='corvette-c8' AND year=2020;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Torch Red',         '#E2001A', id FROM cars WHERE slug='corvette-c8' AND year=2020;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Pearl White',       '#F8F8FF', id FROM cars WHERE slug='model-s-plaid' AND year=2021;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Midnight Silver',   '#5A5D6B', id FROM cars WHERE slug='model-s-plaid' AND year=2021;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Deep Blue',         '#1B3A6B', id FROM cars WHERE slug='model-s-plaid' AND year=2021;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Obsidian Black',    '#1C1C1C', id FROM cars WHERE slug='model-s-plaid' AND year=2021;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Dakar Yellow',      '#F5C518', id FROM cars WHERE slug='e30-m3'     AND year=1987;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Brilliant Red',     '#CC0000', id FROM cars WHERE slug='e30-m3'     AND year=1987;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Alpine White',      '#FFFFFF', id FROM cars WHERE slug='e30-m3'     AND year=1987;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Imola Red',         '#B22222', id FROM cars WHERE slug='m3-e46'     AND year=2001;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Carbon Black',      '#1C1C1C', id FROM cars WHERE slug='m3-e46'     AND year=2001;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Steel Grey',        '#71797E', id FROM cars WHERE slug='m3-e46'     AND year=2001;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Obsidian Black',    '#0A0A0A', id FROM cars WHERE slug='300-sl-gullwing' AND year=1954;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Silver Grey',       '#C0C0C0', id FROM cars WHERE slug='300-sl-gullwing' AND year=1954;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Light Blue',        '#ADD8E6', id FROM cars WHERE slug='300-sl-gullwing' AND year=1954;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Tornado Red',       '#CC0000', id FROM cars WHERE slug='beetle'     AND year=1938;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Harvest Moon Beige','#C3A882', id FROM cars WHERE slug='beetle'     AND year=1938;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Leaf Green',        '#228B22', id FROM cars WHERE slug='beetle'     AND year=1938;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Guards Red',        '#CC0000', id FROM cars WHERE slug='911-gt3-rs'  AND year=2023;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Shark Blue',        '#003B6F', id FROM cars WHERE slug='911-gt3-rs'  AND year=2023;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'GT Silver',         '#8D8D8D', id FROM cars WHERE slug='911-gt3-rs'  AND year=2023;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Chalk',             '#D5D0C8', id FROM cars WHERE slug='911-gt3-rs'  AND year=2023;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Nardo Grey',        '#9C9C9C', id FROM cars WHERE slug='r8-v10'     AND year=2009;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Suzuka Grey',       '#6E6E6E', id FROM cars WHERE slug='r8-v10'     AND year=2009;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Ibis White',        '#F5F5F5', id FROM cars WHERE slug='r8-v10'     AND year=2009;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Nightfall Mica',    '#1C1C2E', id FROM cars WHERE slug='supra-a80'   AND year=1993;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Super White',       '#FFFFFF', id FROM cars WHERE slug='supra-a80'   AND year=1993;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Renaissance Red',   '#CC2200', id FROM cars WHERE slug='supra-a80'   AND year=1993;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Formula Red',       '#CC0000', id FROM cars WHERE slug='250-gto'    AND year=1962;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Blu Pozzi',         '#002FA7', id FROM cars WHERE slug='250-gto'    AND year=1962;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Grigio Argento',    '#C0C0C0', id FROM cars WHERE slug='250-gto'    AND year=1962;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Rosso Corsa',       '#CC0000', id FROM cars WHERE slug='f40'        AND year=1987;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Giallo Modena',     '#FCD116', id FROM cars WHERE slug='f40'        AND year=1987;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Nero',              '#1C1C1C', id FROM cars WHERE slug='f40'        AND year=1987;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Verde Mantis',      '#74C365', id FROM cars WHERE slug='murcielago-lp-640' AND year=2006;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Arancio Atlas',     '#FF6200', id FROM cars WHERE slug='murcielago-lp-640' AND year=2006;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Nero Nemesis',      '#1C1C1C', id FROM cars WHERE slug='murcielago-lp-640' AND year=2006;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Bianco Canopus',    '#F5F5F5', id FROM cars WHERE slug='aventador-svj' AND year=2018;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Arancio Borealis',  '#FF4500', id FROM cars WHERE slug='aventador-svj' AND year=2018;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Verde Scandal',     '#00FF7F', id FROM cars WHERE slug='aventador-svj' AND year=2018;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Rosso',             '#CC0000', id FROM cars WHERE slug='nsx'        AND year=1991;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Grand Prix White',  '#F5F5F5', id FROM cars WHERE slug='nsx'        AND year=1991;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Berlina Black',     '#0A0A0A', id FROM cars WHERE slug='nsx'        AND year=1991;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Sonic Grey Pearl',  '#8B9BB4', id FROM cars WHERE slug='rx-7-fd'    AND year=1991;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Vintage Red',       '#8B0000', id FROM cars WHERE slug='rx-7-fd'    AND year=1991;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Innocent Blue',     '#4169E1', id FROM cars WHERE slug='rx-7-fd'    AND year=1991;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Silver',            '#C0C0C0', id FROM cars WHERE slug='veyron-16-4' AND year=2005;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Nocturne Black',    '#1C1C1C', id FROM cars WHERE slug='veyron-16-4' AND year=2005;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Titanium Grey',     '#878681', id FROM cars WHERE slug='veyron-16-4' AND year=2005;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Black',             '#0A0A0A', id FROM cars WHERE slug='chiron'     AND year=2016;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Italian Red',       '#CC0000', id FROM cars WHERE slug='chiron'     AND year=2016;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Atlantic Blue',     '#006994', id FROM cars WHERE slug='chiron'     AND year=2016;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Black',             '#0A0A0A', id FROM cars WHERE slug='miura'      AND year=1966;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Rosso Corsa',       '#CC0000', id FROM cars WHERE slug='miura'      AND year=1966;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Giallo',            '#FFD700', id FROM cars WHERE slug='miura'      AND year=1966;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Mulliner Silver',   '#C0C0C0', id FROM cars WHERE slug='continental-gt' AND year=2003;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Barnato Green',     '#2E8B57', id FROM cars WHERE slug='continental-gt' AND year=2003;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Beluga Black',      '#1C1C1C', id FROM cars WHERE slug='continental-gt' AND year=2003;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Midnight Sapphire', '#000080', id FROM cars WHERE slug='phantom-viii' AND year=2017;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Arctic White',      '#F8F8FF', id FROM cars WHERE slug='phantom-viii' AND year=2017;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Black Diamond',     '#0A0A0A', id FROM cars WHERE slug='phantom-viii' AND year=2017;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'British Racing Green','#004225',id FROM cars WHERE slug='e-type-series-1' AND year=1961;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Old English White',  '#F5F0E8', id FROM cars WHERE slug='e-type-series-1' AND year=1961;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Carmen Red',         '#990000', id FROM cars WHERE slug='e-type-series-1' AND year=1961;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Aston Racing Green', '#013220', id FROM cars WHERE slug='db5'         AND year=1963;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Silver Birch',       '#C0C0C0', id FROM cars WHERE slug='db5'         AND year=1963;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Midnight Blue',      '#00008B', id FROM cars WHERE slug='db5'         AND year=1963;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Grigio Titanio',    '#7D7D7D', id FROM cars WHERE slug='giulia-quadrifoglio' AND year=2016;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Rosso Competizione','#CC0000', id FROM cars WHERE slug='giulia-quadrifoglio' AND year=2016;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Bianco',            '#F5F5F5', id FROM cars WHERE slug='giulia-quadrifoglio' AND year=2016;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Hyper Blue',        '#0066CC', id FROM cars WHERE slug='ioniq-5'     AND year=2021;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Gravity Gold',      '#8B7355', id FROM cars WHERE slug='ioniq-5'     AND year=2021;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Digital Teal',      '#008080', id FROM cars WHERE slug='ioniq-5'     AND year=2021;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Atlas White',       '#F5F5F5', id FROM cars WHERE slug='ioniq-5'     AND year=2021;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Blaze Blue',        '#003DA5', id FROM cars WHERE slug='ev6-gt'      AND year=2022;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Runway Red',        '#CC0000', id FROM cars WHERE slug='ev6-gt'      AND year=2022;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Snow White Pearl',  '#F5F5F5', id FROM cars WHERE slug='ev6-gt'      AND year=2022;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Bleu Marine',       '#003153', id FROM cars WHERE slug='205-gti'     AND year=1984;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Rouge Vallelunga',  '#CC0000', id FROM cars WHERE slug='205-gti'     AND year=1984;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Blanc Meije',       '#F5F5F5', id FROM cars WHERE slug='205-gti'     AND year=1984;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Shark Grey',        '#6E6E6E', id FROM cars WHERE slug='ds'          AND year=1955;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Cream White',       '#FFFDD0', id FROM cars WHERE slug='ds'          AND year=1955;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Noir',              '#0A0A0A', id FROM cars WHERE slug='ds'          AND year=1955;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Yellow',            '#FFD700', id FROM cars WHERE slug='agera-rs'    AND year=2015;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Naked Carbon',      '#2C2C2C', id FROM cars WHERE slug='agera-rs'    AND year=2015;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'White',             '#F5F5F5', id FROM cars WHERE slug='agera-rs'    AND year=2015;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Radiant Red',       '#CC2200', id FROM cars WHERE slug='stinger-gt'  AND year=2018;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Panthera Metal',    '#4A4A4A', id FROM cars WHERE slug='stinger-gt'  AND year=2018;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Aurora Black Pearl','#0A0A0A', id FROM cars WHERE slug='stinger-gt'  AND year=2018;

INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Rosso Alfa',        '#CC0000', id FROM cars WHERE slug='8c-competizione' AND year=2007;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Nero',              '#1C1C1C', id FROM cars WHERE slug='8c-competizione' AND year=2007;
INSERT INTO car_colors (name, hex_code, car_id) SELECT 'Grigio Argento',    '#C0C0C0', id FROM cars WHERE slug='8c-competizione' AND year=2007;
