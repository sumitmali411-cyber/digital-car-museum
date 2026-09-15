-- USA Manufacturers (country_id = 1)
INSERT INTO manufacturers (name, slug, founded_year, founder_name, headquarters, logo_url, description, website_url, country_id) VALUES
('Ford Motor Company', 'ford', 1903, 'Henry Ford', 'Dearborn, Michigan, USA', 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg',
 'Ford Motor Company is an American multinational automobile manufacturer. Henry Ford founded the company on June 16, 1903. Ford introduced the moving assembly line and made the automobile accessible to the masses with the Model T in 1908. Today Ford is known for iconic models like the Mustang, F-150, and Explorer.',
 'https://www.ford.com', 1),

('Chevrolet', 'chevrolet', 1911, 'Louis Chevrolet, William Durant', 'Detroit, Michigan, USA', 'https://upload.wikimedia.org/wikipedia/commons/1/10/Chevrolet_script_logo.svg',
 'Chevrolet, colloquially referred to as Chevy, is an American automobile division of General Motors. Louis Chevrolet and William C. Durant co-founded Chevrolet in 1911. Known for the Corvette, Camaro, Silverado, and Suburban, Chevrolet is one of the best-selling automobile brands in the world.',
 'https://www.chevrolet.com', 1),

('Tesla', 'tesla', 2003, 'Martin Eberhard, Marc Tarpenning, Elon Musk', 'Austin, Texas, USA', 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
 'Tesla, Inc. is an American electric vehicle and clean energy company. Founded in 2003, Tesla designs and manufactures electric cars, battery energy storage, solar panels and more. Under Elon Musk''s leadership, Tesla revolutionized the EV market with models like the Model S, Model 3, Model X, and Cybertruck.',
 'https://www.tesla.com', 1),

-- Germany Manufacturers (country_id = 2)
('BMW', 'bmw', 1916, 'Karl Rapp, Franz Josef Popp', 'Munich, Bavaria, Germany', 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
 'Bayerische Motoren Werke AG (BMW) is a German multinational corporation producing luxury automobiles and motorcycles. Founded in 1916, BMW is renowned for its performance, luxury, and the tagline "The Ultimate Driving Machine". Notable models include the 3 Series, M5, and the i-series electric vehicles.',
 'https://www.bmw.com', 2),

('Mercedes-Benz', 'mercedes-benz', 1926, 'Karl Benz, Gottlieb Daimler', 'Stuttgart, Baden-Württemberg, Germany', 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg',
 'Mercedes-Benz is a German luxury automobile manufacturer. Created by the 1926 merger of Benz & Cie. and Daimler Motoren Gesellschaft, it is one of the oldest and most respected automobile brands in the world. Karl Benz''s 1886 Patent-Motorwagen is widely regarded as the world''s first automobile.',
 'https://www.mercedes-benz.com', 2),

('Volkswagen', 'volkswagen', 1937, 'Ferdinand Porsche', 'Wolfsburg, Lower Saxony, Germany', 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg',
 'Volkswagen (VW) is a German automobile manufacturer headquartered in Wolfsburg. Founded in 1937, the name means "people''s car" in German. The VW Beetle became one of the best-selling cars in history. Today Volkswagen Group is one of the world''s largest auto manufacturers, owning brands including Audi, Porsche, and Lamborghini.',
 'https://www.volkswagen.com', 2),

('Porsche', 'porsche', 1931, 'Ferdinand Porsche', 'Stuttgart, Baden-Württemberg, Germany', 'https://upload.wikimedia.org/wikipedia/commons/1/13/Porsche_logo.svg',
 'Porsche AG is a German automobile manufacturer specializing in high-performance sports cars, SUVs and sedans. Founded in 1931 by Ferdinand Porsche, the company is known for its iconic 911, as well as the Cayenne, Macan, Panamera, and Taycan electric sports car.',
 'https://www.porsche.com', 2),

('Audi', 'audi', 1909, 'August Horch', 'Ingolstadt, Bavaria, Germany', 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Audi_logo_detail.svg',
 'Audi AG is a German automobile manufacturer that designs, engineers, produces, markets and distributes luxury vehicles. The company name is the Latin translation of the surname of the founder August Horch. Audi''s four rings logo represents the four predecessor companies of the Auto Union. Known for Quattro AWD technology and the TT, R8, and Q series.',
 'https://www.audi.com', 2),

-- Japan Manufacturers (country_id = 3)
('Toyota', 'toyota', 1937, 'Kiichiro Toyoda', 'Toyota City, Aichi, Japan', 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg',
 'Toyota Motor Corporation is a Japanese multinational automotive manufacturer. Founded by Kiichiro Toyoda in 1937, Toyota is the world''s largest automobile manufacturer. Known for reliability, the Toyota Production System (lean manufacturing), and models like the Corolla, Camry, Land Cruiser, and pioneering hybrids with the Prius.',
 'https://www.toyota.com', 3),

('Honda', 'honda', 1948, 'Soichiro Honda', 'Minato City, Tokyo, Japan', 'https://upload.wikimedia.org/wikipedia/commons/7/76/Honda_logo.svg',
 'Honda Motor Co., Ltd. is a Japanese multinational conglomerate manufacturer. Founded by Soichiro Honda in 1948, it is the world''s largest manufacturer of internal combustion engines. Honda is renowned for fuel efficiency, reliability, and iconic models like the Civic, Accord, CR-V, NSX, and S2000.',
 'https://www.honda.com', 3),

('Nissan', 'nissan', 1933, 'Yoshisuke Aikawa', 'Nishi-ku, Yokohama, Japan', 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Nissan_2020_logo.svg',
 'Nissan Motor Co., Ltd. is a Japanese multinational automobile manufacturer. Founded in 1933, Nissan is known for innovation and performance. The GT-R (nicknamed "Godzilla") is a legendary supercar. The Nissan LEAF was the world''s first mass-market electric vehicle. Other notable models include the 370Z, Skyline, and Patrol.',
 'https://www.nissan.com', 3),

('Mazda', 'mazda', 1920, 'Jujiro Matsuda', 'Fuchu, Hiroshima, Japan', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Mazda_logo.svg',
 'Mazda Motor Corporation is a Japanese multinational automaker. Founded in 1920, Mazda is renowned for its rotary engine technology (used in the legendary RX-7 and RX-8) and the SKYACTIV technology philosophy. Mazda is known for driver-focused design under the Jinba Ittai (horse and rider as one) philosophy. The MX-5 Miata is the world''s best-selling two-seater sports car.',
 'https://www.mazda.com', 3),

-- Italy Manufacturers (country_id = 4)
('Ferrari', 'ferrari', 1939, 'Enzo Ferrari', 'Maranello, Emilia-Romagna, Italy', 'https://upload.wikimedia.org/wikipedia/commons/3/34/Ferrari_logo.svg',
 'Ferrari S.p.A. is an Italian luxury sports car manufacturer. Founded by Enzo Ferrari in 1939 as Auto Avio Costruzioni, Ferrari began producing road cars in 1947. Ferrari is synonymous with speed, luxury, and Formula 1 success. The prancing horse (Cavallino Rampante) logo is one of the most recognized in the world. Models include the F40, Enzo, LaFerrari, 488, and SF90.',
 'https://www.ferrari.com', 4),

('Lamborghini', 'lamborghini', 1963, 'Ferruccio Lamborghini', 'Sant''Agata Bolognese, Emilia-Romagna, Italy', 'https://upload.wikimedia.org/wikipedia/commons/7/71/Lamborghini_logo.svg',
 'Automobili Lamborghini S.p.A. is an Italian brand and manufacturer of luxury supercars. Founded in 1963 by Ferruccio Lamborghini (a tractor manufacturer who wanted to improve on Ferrari), Lamborghini became legendary with the Miura and Countach. Today known for the Huracán, Aventador, and Urus SUV. All models are named after famous bulls.',
 'https://www.lamborghini.com', 4),

('Fiat', 'fiat', 1899, 'Giovanni Agnelli', 'Turin, Piedmont, Italy', 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Logo_of_Fiat_since_2020.svg',
 'Fiat (Fabbrica Italiana Automobili Torino) is an Italian automobile manufacturer. Founded in 1899 by a group including Giovanni Agnelli, Fiat is one of the oldest car companies in the world. Fiat made motoring accessible to Italians with the Fiat 500. Today it is part of Stellantis and known for small, stylish city cars.',
 'https://www.fiat.com', 4),

('Alfa Romeo', 'alfa-romeo', 1910, 'Ugo Stella', 'Milan, Lombardy, Italy', 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Alfa_Romeo_logo.svg',
 'Alfa Romeo is an Italian luxury car manufacturer. Founded in 1910 in Milan, Alfa Romeo has a rich motorsport heritage and is known for beautiful, driver-focused cars. Historic models include the Giulia Spider and GTV. Modern lineup features the Giulia sedan, Stelvio SUV, and the Tonale. The Quadrifoglio badge denotes their performance models.',
 'https://www.alfaromeo.com', 4),

-- UK Manufacturers (country_id = 5)
('Rolls-Royce', 'rolls-royce', 1906, 'Charles Rolls, Henry Royce', 'Goodwood, West Sussex, England, UK', 'https://upload.wikimedia.org/wikipedia/commons/8/84/Rolls-Royce_Motor_Cars_logo.svg',
 'Rolls-Royce Motor Cars is a British luxury automobile manufacturer. Founded in 1906 by Charles Rolls and Henry Royce, Rolls-Royce is the epitome of luxury motoring. Each car is largely hand-built at the Home of Rolls-Royce in Goodwood. The Spirit of Ecstasy hood ornament is iconic. Models include the Phantom, Ghost, Wraith, and Cullinan SUV.',
 'https://www.rolls-roycemotorcars.com', 5),

('Bentley', 'bentley', 1919, 'W.O. Bentley', 'Crewe, Cheshire, England, UK', 'https://upload.wikimedia.org/wikipedia/commons/9/91/Bentley_logo.svg',
 'Bentley Motors Limited is a British manufacturer and marketer of luxury cars and SUVs. Founded by W.O. Bentley in 1919, Bentley earned early fame at Le Mans. Now part of the Volkswagen Group, Bentley combines handcrafted British luxury with performance engineering. Models include the Continental GT, Flying Spur, and Bentayga.',
 'https://www.bentleymotors.com', 5),

('Jaguar', 'jaguar', 1922, 'William Lyons, William Walmsley', 'Coventry, West Midlands, England, UK', 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Jaguar_Cars_logo.svg',
 'Jaguar is a British luxury vehicle brand owned by Jaguar Land Rover. Founded as the Swallow Sidecar Company in 1922, Jaguar became famous for sports cars and saloons combining performance with elegance. Historic models include the E-Type (called "the most beautiful car ever made"), XJ, and XK. Now transitioning to all-electric luxury.',
 'https://www.jaguar.com', 5),

('Aston Martin', 'aston-martin', 1913, 'Lionel Martin, Robert Bamford', 'Gaydon, Warwickshire, England, UK', 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Aston_Martin_logo.svg',
 'Aston Martin Lagonda is a British independent manufacturer of luxury sports cars. Founded in 1913, Aston Martin is famous as James Bond''s car of choice. Known for beautiful grand tourers combining power and elegance. Models include the DB series (DB5, DB11, DBS), Vantage, and Valkyrie hypercar. Manufacturing is based at Gaydon, Warwickshire.',
 'https://www.astonmartin.com', 5),

-- South Korea Manufacturers (country_id = 6)
('Hyundai', 'hyundai', 1967, 'Chung Ju-yung', 'Seoul, South Korea', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg',
 'Hyundai Motor Company is a South Korean multinational automotive manufacturer. Founded in 1967, Hyundai has grown from a small Korean automaker to the world''s third-largest automobile manufacturer. Known for value, quality, and the N performance division. Notable models include the Sonata, Tucson, IONIQ 5, and the legendary Pony.',
 'https://www.hyundai.com', 6),

('Kia', 'kia', 1944, 'Kim Chul-ho', 'Seoul, South Korea', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Kia_logo_%282021%29.svg',
 'Kia Corporation is a South Korean multinational automobile manufacturer. Founded in 1944, Kia is the second-largest South Korean car manufacturer, after its affiliate Hyundai. Kia has transformed its image from budget-friendly to modern, stylish vehicles. Notable models include the Stinger, Telluride, EV6, and the iconic Sportage.',
 'https://www.kia.com', 6),

-- France Manufacturers (country_id = 7)
('Renault', 'renault', 1899, 'Louis Renault, Marcel Renault, Fernand Renault', 'Boulogne-Billancourt, Île-de-France, France', 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Renault_2021_Text.svg',
 'Renault S.A. is a French multinational automobile manufacturer. Founded in 1899 by the Renault brothers, it is one of the oldest car manufacturers. Renault has a strong Formula 1 heritage and pioneered electric vehicles in Europe with the Zoe. Known for the Alpine performance brand and iconic models like the R5, Clio, and Megane.',
 'https://www.renault.com', 7),

('Peugeot', 'peugeot', 1882, 'Armand Peugeot', 'Poissy, Île-de-France, France', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Peugeot_2021_Logo.svg',
 'Peugeot is a French brand of automobiles, part of Stellantis. Founded by Armand Peugeot in 1882 (originally as a tool and bicycle manufacturer), it is one of the oldest car brands. Peugeot has a rich motorsport heritage and is known for stylish, driver-focused vehicles. The lion emblem dates back to 1858. Models include the 208, 3008, and 508.',
 'https://www.peugeot.com', 7),

('Citroën', 'citroen', 1919, 'André Citroën', 'Saint-Ouen-sur-Seine, Île-de-France, France', 'https://upload.wikimedia.org/wikipedia/commons/6/62/Citro%C3%ABn_2016_logo.svg',
 'Citroën is a French automobile manufacturer, part of Stellantis. Founded by André Citroën in 1919, Citroën is known for innovative, unconventional engineering and design. Famous for the DS (Goddess), the 2CV (deux chevaux), and the hydropneumatic suspension system. Today known for comfortable, affordable French cars with distinctive styling.',
 'https://www.citroen.com', 7),

('Bugatti', 'bugatti', 1909, 'Ettore Bugatti', 'Molsheim, Alsace, France', 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Bugatti_logo.svg',
 'Bugatti Automobiles S.A.S. is a French high-performance luxury automobile manufacturer. Founded by Ettore Bugatti in 1909 in Molsheim, Alsace, Bugatti builds the world''s most exclusive and powerful cars. The Veyron became the fastest production car in the world in 2005. The Chiron and its variants continue this legacy of engineering extremes.',
 'https://www.bugatti.com', 7),

-- Sweden Manufacturers (country_id = 8)
('Volvo Cars', 'volvo', 1927, 'Assar Gabrielsson, Gustaf Larson', 'Gothenburg, Västra Götaland, Sweden', 'https://upload.wikimedia.org/wikipedia/commons/3/36/Volvo_Cars-Logo.svg',
 'Volvo Cars is a Swedish luxury vehicle manufacturer. Founded in 1927 in Gothenburg, Volvo is globally recognized as a leader in automotive safety — inventing the three-point seat belt in 1959 and giving the patent to the world. Known for durable, safe, and comfortable vehicles. The XC90, XC60, and V series are modern bestsellers. Now owned by Geely.',
 'https://www.volvocars.com', 8),

('Koenigsegg', 'koenigsegg', 1994, 'Christian von Koenigsegg', 'Ängelholm, Skåne, Sweden', 'https://upload.wikimedia.org/wikipedia/commons/3/39/Koenigsegg-logo.svg',
 'Koenigsegg Automotive AB is a Swedish manufacturer of high-performance sports cars. Founded in 1994 by Christian von Koenigsegg, the company produces some of the world''s fastest cars. The CCR broke the production car speed record in 2005. The Agera RS set a 457 km/h record in 2017. The Jesko Absolut is engineered for over 500 km/h. A true hypercar pioneer.',
 'https://www.koenigsegg.com', 8),

-- India Manufacturers (country_id = 9)
('Tata Motors', 'tata-motors', 1945, 'J.R.D. Tata', 'Mumbai, Maharashtra, India', 'https://upload.wikimedia.org/wikipedia/commons/2/21/Tata_logo.svg',
 'Tata Motors Limited is an Indian multinational automotive manufacturing company. Founded in 1945 as TELCO (Tata Engineering and Locomotive Co.), it is part of the Tata Group conglomerate. Tata Motors acquired Jaguar Land Rover from Ford in 2008. Known for commercial vehicles, buses, and passenger cars. The Nano was the world''s cheapest production car. Now pioneering EVs in India with Nexon EV.',
 'https://www.tatamotors.com', 9),

('Mahindra', 'mahindra', 1945, 'J.C. Mahindra, K.C. Mahindra, Ghulam Mohammed', 'Mumbai, Maharashtra, India', 'https://upload.wikimedia.org/wikipedia/commons/5/55/Mahindra_Logo_Blk.jpg',
 'Mahindra & Mahindra Limited is an Indian multinational automotive manufacturing corporation. Founded in 1945, Mahindra is one of the largest vehicle manufacturers in India by production capacity. Known for rugged SUVs and utility vehicles. The Thar is an iconic off-roader. Mahindra also competes in Formula E through Mahindra Racing.',
 'https://www.mahindra.com', 9),

-- Czech Republic Manufacturers (country_id = 10)
('Škoda Auto', 'skoda', 1895, 'Václav Laurin, Václav Klement', 'Mladá Boleslav, Bohemia, Czech Republic', 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Skoda_auto_logo_%282016%29.svg',
 'Škoda Auto is a Czech automobile manufacturer founded in 1895 as Laurin & Klement. It is one of the oldest car manufacturers in the world, having started with bicycles and motorcycles before producing cars. Now part of the Volkswagen Group since 1991. Škoda offers practical, value-oriented vehicles. Models include the Octavia, Superb, Kodiaq, and Enyaq EV.',
 'https://www.skoda-auto.com', 10);
