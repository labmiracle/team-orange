########################################################################
# PRE-DEPLOYMENT
########################################################################
# drops the database if the database already exists.
# uncomment this line if you want to recreate the database.
# DROP DATABASE IF EXISTS `shoppy_db`;
# FLAGS: --default-character-set=tf8mb4
# creates a new database.
CREATE DATABASE IF NOT EXISTS `shoppy_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

# select the database.
use `shoppy_db`;



########################################################################
# TABLES
########################################################################

CREATE TABLE IF NOT EXISTS User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    idDocumentType VARCHAR (20) NOT NULL,
    idDocumentNumber VARCHAR(20) NOT NULL UNIQUE,
    rol ENUM('Admin', 'Client', 'Manager') NOT NULL DEFAULT 'Client',
    status BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS Category(
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Size(
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Brand (
	id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Store (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    managerId INT,
    apiUrl VARCHAR(255) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_managerId_s FOREIGN KEY (managerId) REFERENCES User(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS StoreColor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('PRIMARY','SECONDARY'),
    hue INT NOT NULL,
    sat INT NOT NULL,
    light INT NOT NULL,
    storeId INT NOT NULL,
    CONSTRAINT fk_storeId_sc FOREIGN KEY (storeId) REFERENCES Store(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Invoice (
	id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    total DECIMAL(15,2) NOT NULL,
    userId INT NOT NULL,
    CONSTRAINT fk_userId_purchase FOREIGN KEY (userId) REFERENCES User(id)
);

CREATE TABLE IF NOT EXISTS Product(
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discountPercentage DECIMAL(3,2),
    currentStock INT NOT NULL,
    reorderPoint INT NOT NULL,
    minimum INT NOT NULL,
    brandId INT NOT NULL,
    url_img VARCHAR(255) NOT NULL,
    storeId INT,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_brandId_p FOREIGN KEY (brandId) REFERENCES Brand(id),
    CONSTRAINT fk_storeId_p FOREIGN KEY (storeId) REFERENCES Store(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ProductSize (
    id INT PRIMARY KEY AUTO_INCREMENT,
    productId INT NOT NULL,
    sizeId INT NOT NULL,
    CONSTRAINT fk_productId_ps FOREIGN KEY (productId) REFERENCES Product(id),
    CONSTRAINT fk_sizeId_ps FOREIGN KEY (sizeId) REFERENCES Size(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ProductCategory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    productId INT NOT NULL,
    categoryId INT NOT NULL,
    CONSTRAINT fk_productId_pc FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE,
    CONSTRAINT fk_categoryId_pc FOREIGN KEY (categoryId) REFERENCES Category(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Item (
	id INT PRIMARY KEY AUTO_INCREMENT,
    quantity INT NOT NULL,
    total DECIMAL(15,2) NOT NULL,
    unitPrice DECIMAL(10,2) NOT NULL,
    productId INT NOT NULL UNIQUE,
    invoiceId  INT NOT NULL,
    CONSTRAINT fk_productId_i FOREIGN KEY (productId) REFERENCES Product(id),
    CONSTRAINT fk_purchaseId_i FOREIGN KEY (invoiceId) REFERENCES Invoice(id)
);

CREATE TABLE IF NOT EXISTS Cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    productId INT NOT NULL UNIQUE,
    quantity INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_userId_c FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    CONSTRAINT fk_productId_c FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
);


########################################################################
# TABLE UPGRADES
########################################################################


########################################################################
# VIEWS
########################################################################

CREATE OR REPLACE VIEW product_view AS
    SELECT
        P.id,
        P.name,
        P.description,
        P.price,
        P.discountPercentage,
        P.currentStock,
        P.reorderPoint,
        P.minimum,
        P.storeId,
        P.url_img,
        B.name AS brand,
        (
            SELECT JSON_ARRAYAGG(CategoryName)
            FROM (
            SELECT DISTINCT Category.name AS CategoryName
            FROM Category
            INNER JOIN ProductCategory ON ProductCategory.categoryId = Category.id
            WHERE ProductCategory.productId = P.id
            ) AS Category
        ) AS categories,
        JSON_ARRAYAGG(size.name) AS sizes,
        P.status
    FROM
        Product AS P
    LEFT JOIN
        Brand AS B ON P.brandId = B.id
    LEFT JOIN
        ProductSize ON P.id = ProductSize.productId
    LEFT JOIN
        Size ON ProductSize.sizeId = Size.id
    GROUP BY
        P.id,
        P.name,
        P.description,
        P.price,
        P.discountPercentage,
        P.currentStock,
        P.reorderPoint,
        P.minimum,
        P.storeId,
        P.url_img,
        P.status;

CREATE OR REPLACE VIEW invoice_view AS
  SELECT
    inv.id,
    inv.date As date,
    inv.total AS total,
    u.name,
    u.lastName,
    u.email,
    u.idDocumentType,
    u.idDocumentNumber,
    (SELECT JSON_ARRAYAGG(JSON_OBJECT('name', p.name, 'store', s.name, 'price', i.unitPrice, 'quantity', i.quantity, 'total', i.total))) as products
  FROM invoice inv
  JOIN user u ON u.id = inv.userId
  JOIN item i ON i.invoiceId = inv.id
  JOIN product p ON p.id = i.productId
  JOIN store s ON s.id = p.storeId
  GROUP BY
    id,
    date,
    total,
    userId;

CREATE OR REPLACE VIEW cart_view AS
	SELECT
    i.id,
    inv.userId,
    pv.id AS productId,
    pv.name,
    pv.description,
    pv.price,
    i.quantity,
    (pv.price*pv.discountPercentage*i.quantity) as total,
    pv.discountPercentage,
    pv.storeId,
    pv.url_img,
    pv.brand,
    pv.categories,
    pv.sizes
	FROM Item i
	JOIN
	  product_view pv ON pv.id = c.productId
  JOIN
    invoice inv ON i.invoiceId = inv.id;

########################################################################
# STORED PROCEDURES
########################################################################


########################################################################
# POST-DEPLOYMENT
########################################################################

INSERT INTO Brand (name)
VALUES
  ('Nike'),
  ('Topper'),
  ('Adidas'),
  ('Casio'),
  ('Zara'),
  ('Gucci'),
  ('LaCoste'),
  ('Levi'),
  ('Chanel'),
  ('Cheeky'),
  ('Forever21'),
  ('Swarovski'),
  ('Polo');

INSERT INTO User (name, lastName, email, password, idDocumentType, idDocumentNumber, rol)
VALUES
  ('John', 'Doe', 'admin@example.com', 'test1234', 'DNI', '1234567891', 'admin'),
  ('Joe', 'Schmo', 'manager@example.com', 'test1234', 'DNI', '1234567892', 'manager'),
  ('Pedro', 'Perez', 'client@example.com', 'test1234', 'DNI', '1234567893', 'client');

INSERT INTO Store (name, managerId, apiUrl)
VALUES
  ('Armario', 1, 'https://api.example.com'),
  ('Atico Vintage', 2, 'https://api.example.com'),
  ('Pasamela', 3, 'https://api.example.com');

INSERT INTO StoreColor (type, hue, sat, light, storeId)
VALUES
	('PRIMARY', 233, 29, 12, 1),
	('SECONDARY',187, 56, 38, 1),
	('PRIMARY', 331, 96, 43, 2),
	('SECONDARY',51, 100, 50, 2),
	('PRIMARY', 11, 96, 40, 3),
	('SECONDARY',32, 100, 73, 3);

INSERT INTO Product (name, description, price, discountPercentage, currentStock, reorderPoint, minimum, brandId, url_img, storeId)
VALUES
  ('Chaqueta de invierno', 'Chaqueta abrigada para el invierno', 129.99, 1, 50, 10, 5, 1, 'images/chaqueta_de_invierno.webp', 1),
  ('Sudadera con capucha', 'Sudadera con capucha para uso casual', 59.99, 1, 80, 20, 10, 2, 'images/sudadera_con_capucha.webp', 2),
  ('Zapatillas de running', 'Zapatillas ligeras para correr', 89.99, 0.7, 100, 30, 15, 3, 'images/zapatillas_adidas.webp', 3),
  ('Vestido floral', 'Vestido de estilo floral para ocasiones especiales', 69.99, 1, 30, 5, 3, 4, 'images/vestido_floral.webp', 1),
  ('Pantalón de mezclilla', 'Pantalón de mezclilla clásico para hombres', 49.99, 1, 60, 15, 5, 1, 'images/pantalon_de_mezclilla.webp', 2),
  ('Shorts de playa', 'Shorts de playa para hombres', 24.99, 1, 90, 20, 10, 1, 'images/shorts_de_playa.webp', 3),
  ('Blusa de encaje', 'Blusa de encaje elegante para mujeres', 39.99, 0.6, 50, 10, 5, 2, 'images/blusa_de_encaje.webp', 1),
  ('Zapatos de vestir', 'Zapatos de vestir clásicos para hombres', 79.99, 1, 40, 10, 5, 1, 'images/zapatos_de_vestir.webp', 2),
  ('Blusa estampada', 'Blusa estampada de manga larga', 29.99, 0.9, 70, 15, 5, 2, 'images/blusa_estampada.webp', 3),
  ('Gorra de béisbol', 'Gorra de béisbol con diseño moderno', 19.99, 1, 100, 20, 10, 6, 'images/gorra_de_beisbol.webp', 1),
  ('Traje de baño', 'Traje de baño de dos piezas para mujeres', 49.99, 0.7, 60, 10, 5, 5, 'images/traje_de_baño.webp', 2),
  ('Polo clásico', 'Camisa polo de manga corta para hombres', 34.99, 1, 80, 20, 10, 1, 'images/polo_clásico.webp', 3),
  ('Pantalones cortos deportivos', 'Pantalones cortos deportivos para hombres', 24.99, 1, 90, 20, 10, 7, 'images/pantalones_cortos_deportivos.webp', 1),
  ('Vestido de cóctel', 'Vestido elegante para eventos de cóctel', 79.99, 1, 30, 5, 3, 8, 'images/vestido_de_cóctel.webp', 2),
  ('Jersey de punto', 'Jersey de punto cálido y suave', 59.99, 0.5, 50, 10, 5, 5, 'images/jersey_de_punto.webp', 3),
  ('Camisa de manga larga', 'Camisa de manga larga para hombres', 39.99, 1, 70, 15, 5, 13, 'images/camisa_de_manga_larga.webp', 1),
  ('Sandalias de playa', 'Sandalias cómodas para uso en la playa', 29.99, 0.7, 80, 20, 10, 10, 'images/sandalias_de_playa.webp', 2),
  ('Vestido de verano', 'Vestido de verano ligero y fresco', 49.99, 1, 40, 5, 3, 4, 'images/vestido_de_verano.webp', 3),
  ('Pantalones de vestir', 'Pantalones de vestir elegantes para hombres', 69.99, 0.4, 60, 15, 5, 3, 'images/pantalones_de_vestir.webp', 1),
  ('Sudadera con cierre', 'Sudadera con cierre para uso casual', 44.99, 1, 90, 20, 10, 2, 'images/sudadera_con_cierre.webp', 2),
  ('Zapatos casuales', 'Zapatos casuales cómodos para hombres', 69.99, 0.9, 50, 10, 5, 6, 'images/zapatos_casuales.webp', 3),
  ('Vestido de encaje', 'Vestido de encaje elegante para ocasiones especiales', 89.99, 1, 30, 5, 3, 4, 'images/vestido_de_encaje.webp', 1),
  ('Jeans desgastados', 'Jeans desgastados de estilo moderno', 59.99, 0.75, 70, 15, 5, 5, 'images/jeans_desgastados.webp', 2),
  ('Blusa de seda', 'Blusa de seda suave y elegante', 49.99, 1, 80, 20, 10, 2, 'images/blusa_de_seda.webp', 3),
  ('Chaqueta deportiva', 'Chaqueta deportiva ligera para hombres', 79.99, 0.6, 100, 30, 15, 3, 'images/chaqueta_deportiva.webp', 1),
  ('Vestido de noche', 'Vestido de noche elegante para ocasiones especiales', 129.99, 1, 30, 5, 3, 4, 'images/vestido_de_noche.webp', 2),
  ('Camisa manga corta', 'Camisa polo de manga corta para hombres', 34.99, 1, 70, 15, 5, 1, 'images/polo_camisa.webp', 3),
  ('Sudadera estampada', 'Sudadera estampada con diseño único', 54.99, 0.5, 90, 20, 10, 2, 'images/sudadera_estampada.webp', 1),
  ('Zapatos deportivos', 'Zapatos deportivos cómodos para hombres', 79.99, 1, 40, 10, 5, 10, 'images/zapatos_deportivos.webp', 2),
  ('Blusa a rayas', 'Blusa de manga corta a rayas', 29.99, 1, 80, 20, 10, 2, 'images/blusa_a_rayas.webp', 3),
  ('Chaqueta de mezclilla', 'Chaqueta de mezclilla clásica para hombres', 69.99, 1, 50, 10, 5, 10, 'images/chaqueta_de_mezclilla.webp', 1),
  ('Vestido de verano floral', 'Vestido de verano con estampado floral', 59.99, 1, 80, 20, 10, 12, 'images/vestido_de_verano_floral.webp', 2),
  ('Sneakers deportivos', 'Sneakers deportivos para entrenamiento', 89.99, 1, 100, 30, 15, 13, 'images/sneakers_deportivos.webp', 3),
  ('Blazer formal', 'Blazer formal de alta calidad', 129.99, 1, 30, 5, 3, 4, 'images/blazer_formal.webp', 1),
  ('Pantalones cortos de playa', 'Pantalones cortos de playa para hombres', 39.99, 0.5, 60, 15, 5, 1, 'images/pantalones_cortos_de_playa.webp', 2),
  ('Falda plisada', 'Falda plisada de estilo retro', 34.99, 1, 90, 20, 10, 1, 'images/falda_plisada.webp', 3),
  ('Camiseta estampada', 'Camiseta estampada de manga corta para mujeres', 24.99, 1, 100, 20, 10, 2, 'images/camiseta_estampada.webp', 1),
  ('Botas de cuero', 'Botas de cuero duraderas para hombres', 89.99, 0.7, 40, 10, 5, 1, 'images/botas_de_cuero.webp', 2),
  ('Blusa de lunares', 'Blusa de manga larga con estampado de lunares', 29.99, 1, 70, 15, 5, 2, 'images/blusa_de_lunares.webp', 3),
  ('Gorra de moda', 'Gorra de moda con diseño moderno', 19.99, 1, 100, 20, 10, 3, 'images/gorra_de_moda.webp', 1),
  ('Traje de baño de una pieza', 'Traje de baño de una pieza para mujeres', 49.99, 1, 60, 10, 5, 4, 'images/traje_de_baño_de_una_pieza.webp', 2),
  ('Pantalones de vestir clásicos', 'Pantalones de vestir clásicos para hombres', 39.99, 1, 70, 15, 5, 1, 'images/pantalones_de_vestir_clásicos.webp', 3),
  ('Shorts deportivos', 'Shorts deportivos para hombres', 29.99, 1, 90, 20, 10, 3, 'images/shorts_deportivos.webp', 1),
  ('Vestido elegante de noche', 'Vestido elegante de noche para ocasiones especiales', 149.99, 1, 30, 5, 3, 4, 'images/vestido_elegante_de_noche.webp', 2),
  ('Jersey de cuello alto', 'Jersey de cuello alto para hombres', 59.99, 1, 50, 10, 5, 5, 'images/jersey_de_cuello_alto.webp', 3),
  ('Camisa de lino', 'Camisa de lino de manga corta para hombres', 49.99, 1, 70, 15, 5, 6, 'images/camisa_de_lino.webp', 1),
  ('Sandalias cómodas', 'Sandalias cómodas para uso diario', 29.99, 1, 80, 20, 10, 3, 'images/sandalias_cómodas.webp', 2),
  ('Vestido de noche con encaje', 'Vestido de noche con detalles de encaje', 69.99, 1, 40, 10, 5, 7, 'images/vestido_de_noche_con_encaje.webp', 3),
  ('Pantalones de vestir ajustados', 'Pantalones de vestir ajustados para hombres', 79.99, 1, 60, 15, 5, 7, 'images/pantalones_de_vestir_clásicos.webp', 1),
  ('Sudadera ligera', 'Sudadera ligera para uso casual', 44.99, 1, 90, 20, 10, 2, 'images/sudadera_ligera.webp', 2),
  ('Zapatos casuales de cuero', 'Zapatos casuales de cuero para hombres', 69.99, 0.6, 50, 10, 5, 9, 'images/zapatos_casuales_de_cuero.webp', 3),
  ('Vestido de encaje elegante', 'Vestido de encaje elegante para ocasiones especiales', 89.99, 1, 30, 5, 3, 13, 'images/vestido_de_noche_con_encaje.webp', 1),
  ('Jeans de estilo vintage', 'Jeans de estilo vintage para hombres', 59.99, 0.7, 70, 15, 5, 11, 'images/jeans_de_estilo_vintage.webp', 2),
  ('Blusa de seda con estampado', 'Blusa de seda con estampado floral', 49.99, 1, 80, 20, 10, 12, 'images/blusa_de_seda_con_estampado.webp', 3),
  ('Chaqueta deportiva transpirable', 'Chaqueta deportiva transpirable para hombres', 79.99, 1, 100, 30, 15, 3, 'images/chaqueta_deportiva_transpirable.webp', 1),
  ('Vestido de noche elegante', 'Vestido de noche elegante para ocasiones especiales', 129.99, 1, 30, 5, 3, 9, 'images/vestido_elegante_de_noche.webp', 2),
  ('Sneakers de moda', 'Sneakers de moda para uso diario', 59.99, 1, 80, 20, 10, 3, 'images/sneakers_deportivos.webp', 3),
  ('Camiseta de manga larga', 'Camiseta de manga larga para hombres', 34.99, 1, 70, 15, 5, 8, 'images/camisa_de_manga_larga.webp', 1),
  ('Vestido de cóctel con brillos', 'Vestido de cóctel con detalles brillantes', 149.99, 1, 40, 5, 3, 8, 'images/vestido_de_cóctel_con_brillos.webp', 2),
  ('Chaqueta de punto', 'Chaqueta de punto cálida y suave', 69.99, 0.6, 60, 15, 5, 5, 'images/chaqueta_de_punto.webp', 3),
  ('Blusa de manga corta', 'Blusa de manga corta para mujeres', 39.99, 1, 70, 15, 5, 7, 'images/blusa_de_manga_corta.webp', 1),
  ('Sandalias de playa', 'Sandalias de playa cómodas y ligeras', 29.99, 1, 80, 20, 10, 13, 'images/sandalias_de_playa_2.webp', 2),
  ('Vestido estampado de verano', 'Vestido estampado de verano para ocasiones informales', 49.99, 1, 60, 10, 5, 4, 'images/vestido_estampado_de_verano.webp', 3);

INSERT INTO Category (name)
VALUES
  ('Chaqueta'),
  ('Sudadera'),
  ('Zapatillas'),
  ('Vestido'),
  ('Pantalon'),
  ('Shorts'),
  ('Blusa'),
  ('Zapatos'),
  ('Gorra'),
  ('Traje'),
  ('Polo'),
  ('Jersey'),
  ('Camisa'),
  ('Sandalias'),
  ('Jeans'),
  ('Blazer'),
  ('Falda'),
  ('Camiseta'),
  ('Botas'),
  ('Traje de baño');

INSERT INTO ProductCategory (productId, categoryId)
VALUES
  (1,1),
  (2,2),
  (3,3),
  (4,4),
  (5,5),
  (6,6),
  (7,7),
  (8,8),
  (9,7),
  (10,9),
  (11,20),
  (12,13),
  (13,6),
  (14,4),
  (15,12),
  (16,13),
  (17,14),
  (18,4),
  (19,5),
  (20,2),
  (21,8),
  (22,4),
  (23,15),
  (24,7),
  (25,1),
  (26,4),
  (27,13),
  (28,2),
  (29,8),
  (30,7),
  (31,1),
  (32,4),
  (33,3),
  (34,16),
  (35,6),
  (36,17),
  (37,18),
  (38,19),
  (39,7),
  (40,9),
  (41,20),
  (42,5),
  (43,6),
  (44,4),
  (45,12),
  (46,13),
  (47,14),
  (48,4),
  (49,5),
  (50,2),
  (51,8),
  (52,4),
  (53,15),
  (54,7),
  (55,1),
  (56,4),
  (57,3),
  (58,13),
  (59,4),
  (60,1),
  (61,7),
  (62,14),
  (63,4);

INSERT INTO Size (name)
VALUES
  ('Hombre'),
  ('Mujer'),
  ('Niños');

INSERT INTO ProductSize (productId, sizeId)
VALUES
  (1,1),
  (2,2),
  (3,3),
  (4,2),
  (5,1),
  (6,1),
  (7,2),
  (8,2),
  (9,2),
  (10,1),
  (11,2),
  (12,1),
  (13,1),
  (14,2),
  (15,1),
  (15,3),
  (16,1),
  (17,1),
  (18,2),
  (19,1),
  (20,2),
  (21,1),
  (22,2),
  (23,1),
  (24,2),
  (25,1),
  (26,2),
  (27,1),
  (28,1),
  (28,2),
  (29,1),
  (30,3),
  (31,1),
  (32,2),
  (33,1),
  (33,2),
  (33,3),
  (34,1),
  (35,1),
  (36,2),
  (37,2),
  (38,1),
  (39,2),
  (39,3),
  (40,1),
  (40,2),
  (40,3),
  (41,2),
  (42,1),
  (43,1),
  (44,2),
  (45,1),
  (46,1),
  (47,1),
  (47,2),
  (27,3),
  (48,2),
  (49,1),
  (50,1),
  (50,2),
  (51,1),
  (52,2),
  (53,1),
  (54,1),
  (54,2),
  (54,3),
  (55,1),
  (56,2),
  (57,1),
  (58,1),
  (58,2),
  (59,2),
  (60,1),
  (61,2),
  (62,1),
  (62,2),
  (62,3),
  (63,2);


-- INSERT INTO Product (name, description, price, discountPercentage, currentStock, reorderPoint, minimum, brandId, url_img, storeId)
-- VALUES
--   ('Campera de plumas', 'Campera de plumas ligera y abrigada', 119.99, 1, 50, 10, 5, 1, 'https://ejemplo.com/imagen74.jpg', 1),
--   ('Vestido de verano de lunares', 'Vestido de verano con estampado de lunares', 49.99, 1, 80, 20, 10, 2, 'https://ejemplo.com/imagen75.jpg', 1),
--   ('Zapatillas para entrenamiento', 'Zapatillas para entrenamiento y actividades deportivas', 79.99, 0.1, 100, 30, 15, 3, 'https://ejemplo.com/imagen76.jpg', 2),
--   ('Chaqueta elegante', 'Chaqueta elegante para ocasiones formales', 149.99, 1, 30, 5, 3, 4, 'https://ejemplo.com/imagen77.jpg', 2),
--   ('Pantalones de lino', 'Pantalones de lino ligeros para hombres', 59.99, 0.05, 60, 15, 5, 1, 'https://ejemplo.com/imagen78.jpg', 1),
--   ('Shorts de mezclilla', 'Shorts de mezclilla para hombres', 29.99, 1, 90, 20, 10, 1, 'https://ejemplo.com/imagen79.jpg', 1),
--   ('Blusa estampada de manga larga', 'Blusa estampada de manga larga para mujeres', 24.99, 1, 100, 20, 10, 2, 'https://ejemplo.com/imagen80.jpg', 1),
--   ('Botas de montaña', 'Botas de montaña resistentes para hombres', 89.99, 0.2, 40, 10, 5, 1, 'https://ejemplo.com/imagen81.jpg', 1),
--   ('Blusa de encaje de manga corta', 'Blusa de encaje de manga corta para mujeres', 34.99, 0.05, 70, 15, 5, 2, 'https://ejemplo.com/imagen82.jpg', 2),
--   ('Gorra de estilo retro', 'Gorra de estilo retro con diseño vintage', 19.99, 1, 100, 20, 10, 3, 'https://ejemplo.com/imagen83.jpg', 2),
--   ('Traje de baño de dos piezas', 'Traje de baño de dos piezas para mujeres', 49.99, 0.1, 60, 10, 5, 4, 'https://ejemplo.com/imagen84.jpg', 3),
--   ('Pantalones cortos casuales', 'Pantalones cortos casuales para hombres', 39.99, 1, 70, 15, 5, 1, 'https://ejemplo.com/imagen85.jpg', 3),
--   ('Sudadera deportiva', 'Sudadera deportiva para uso casual', 29.99, 1, 90, 20, 10, 3, 'https://ejemplo.com/imagen86.jpg', 3),
--   ('Vestido de noche con brillos', 'Vestido de noche con detalles brillantes', 139.99, 1, 30, 5, 3, 4, 'https://ejemplo.com/imagen87.jpg', 3),
--   ('Jersey de cuello en V', 'Jersey de cuello en V para hombres', 49.99, 0.15, 50, 10, 5, 5, 'https://ejemplo.com/imagen88.jpg', 1),
--   ('Camisa estampada de manga corta', 'Camisa estampada de manga corta para hombres', 39.99, 1, 70, 15, 5, 1, 'https://ejemplo.com/imagen89.jpg', 1),
--   ('Sandalias cómodas para caminar', 'Sandalias cómodas para caminar en verano', 29.99, 1, 80, 20, 10, 3, 'https://ejemplo.com/imagen90.jpg', 2),
--   ('Vestido de noche elegante', 'Vestido de noche elegante para ocasiones especiales', 119.99, 1, 30, 5, 3, 4, 'https://ejemplo.com/imagen91.jpg', 2),
--   ('Pantalones de vestir a rayas', 'Pantalones de vestir a rayas para hombres', 69.99, 0.1, 60, 15, 5, 1, 'https://ejemplo.com/imagen92.jpg', 1),
--   ('Sudadera con capucha y cierre', 'Sudadera con capucha y cierre frontal', 54.99, 1, 90, 20, 10, 2, 'https://ejemplo.com/imagen93.jpg', 1),
--   ('Zapatos casuales de tela', 'Zapatos casuales de tela para hombres', 69.99, 0.05, 50, 10, 5, 1, 'https://ejemplo.com/imagen94.jpg', 1),
--   ('Vestido de noche con encaje', 'Vestido de noche con detalles de encaje', 99.99, 1, 30, 5, 3, 4, 'https://ejemplo.com/imagen95.jpg', 2),
--   ('Jeans rasgados', 'Jeans rasgados de estilo moderno para hombres', 59.99, 0.1, 70, 15, 5, 1, 'https://ejemplo.com/imagen96.jpg', 2),
--   ('Blusa de seda estampada', 'Blusa de seda estampada para mujeres', 49.99, 1, 80, 20, 10, 2, 'https://ejemplo.com/imagen97.jpg', 3),
--   ('Chaqueta deportiva impermeable', 'Chaqueta deportiva impermeable para hombres', 79.99, 0.15, 100, 30, 15, 3, 'https://ejemplo.com/imagen98.jpg', 3),
--   ('Vestido de noche con transparencias', 'Vestido de noche con detalles de transparencias', 139.99, 1, 30, 5, 3, 4, 'https://ejemplo.com/imagen99.jpg', 1),
--   ('Camiseta estampada de manga larga', 'Camiseta estampada de manga larga para hombres', 34.99, 1, 70, 15, 5, 1, 'https://ejemplo.com/imagen100.jpg', 1),
--   ('Sandalias de verano', 'Sandalias cómodas y elegantes para mujeres', 39.99, 0.05, 80, 20, 10, 3, 'https://ejemplo.com/imagen101.jpg', 2),
--   ('Vestido de fiesta largo', 'Vestido de fiesta largo para ocasiones especiales', 129.99, 1, 30, 5, 3, 4, 'https://ejemplo.com/imagen102.jpg', 2),
--   ('Jersey de punto con cuello alto', 'Jersey de punto con cuello alto para hombres', 69.99, 0.1, 50, 10, 5, 5, 'https://ejemplo.com/imagen103.jpg', 1);
--   ('Chaqueta de cuero', 'Chaqueta de cuero elegante para hombres', 199.99, 1, 50, 10, 5, 1, 'https://ejemplo.com/imagen104.jpg', 1),
--   ('Vestido estampado de verano', 'Vestido estampado de verano para ocasiones informales', 59.99, 1, 80, 20, 10, 2, 'https://ejemplo.com/imagen105.jpg', 1),
--   ('Zapatillas de baloncesto', 'Zapatillas de baloncesto de alta calidad', 129.99, 0.1, 100, 30, 15, 3, 'https://ejemplo.com/imagen106.jpg', 2),
--   ('Chaqueta de terciopelo', 'Chaqueta de terciopelo suave y elegante', 159.99, 1, 30, 5, 3, 4, 'https://ejemplo.com/imagen107.jpg', 2),
--   ('Pantalones cortos de algodón', 'Pantalones cortos de algodón para hombres', 39.99, 0.05, 60, 15, 5, 1, 'https://ejemplo.com/imagen108.jpg', 1),
--   ('Vestido de playa', 'Vestido de playa ligero y cómodo', 29.99, 1, 90, 20, 10, 1, 'https://ejemplo.com/imagen109.jpg', 1),
--   ('Blusa estampada de manga corta', 'Blusa estampada de manga corta para mujeres', 24.99, 1, 100, 20, 10, 2, 'https://ejemplo.com/imagen110.jpg', 1),
--   ('Botas de invierno', 'Botas de invierno resistentes para hombres', 119.99, 0.2, 40, 10, 5, 1, 'https://ejemplo.com/imagen111.jpg', 1),
--   ('Blusa de seda estampada', 'Blusa de seda estampada para mujeres', 34.99, 0.05, 70, 15, 5, 2, 'https://ejemplo.com/imagen112.jpg', 2),
--   ('Gorra deportiva', 'Gorra deportiva con diseño moderno', 19.99, 1, 100, 20, 10, 3, 'https://ejemplo.com/imagen113.jpg', 2),
--   ('Traje de baño de una pieza', 'Traje de baño de una pieza para mujeres', 49.99, 0.1, 60, 10, 5, 4, 'https://ejemplo.com/imagen114.jpg', 3),
--   ('Pantalones cortos casuales', 'Pantalones cortos casuales para hombres', 39.99, 1, 70, 15, 5, 1, 'https://ejemplo.com/imagen115.jpg', 3),
--   ('Sudadera con capucha y estampado', 'Sudadera con capucha y estampado moderno', 29.99, 1, 90, 20, 10, 3, 'https://ejemplo.com/imagen116.jpg', 3),
--   ('Vestido largo de gala', 'Vestido largo de gala para ocasiones especiales', 199.99, 1, 30, 5, 3, 4, 'https://ejemplo.com/imagen117.jpg', 3),
--   ('Jersey de lana', 'Jersey de lana cálido y suave', 79.99, 0.15, 50, 10, 5, 5, 'https://ejemplo.com/imagen118.jpg', 1),
--   ('Camisa a rayas de manga corta', 'Camisa a rayas de manga corta para hombres', 39.99, 1, 70, 15, 5, 1, 'https://ejemplo.com/imagen119.jpg', 1),
--   ('Sandalias cómodas de verano', 'Sandalias cómodas de verano para mujeres', 29.99, 1, 80, 20, 10, 3, 'https://ejemplo.com/imagen120.jpg', 2),
--   ('Vestido de noche con pedrería', 'Vestido de noche con detalles de pedrería', 149.99, 1, 30, 5, 3, 4, 'https://ejemplo.com/imagen121.jpg', 2),
--   ('Pantalones de vestir ajustados', 'Pantalones de vestir ajustados para hombres', 79.99, 0.1, 60, 15, 5, 1, 'https://ejemplo.com/imagen122.jpg', 1),
--   ('Sudadera con cierre y capucha', 'Sudadera con cierre y capucha para uso casual', 54.99, 1, 90, 20, 10, 2, 'https://ejemplo.com/imagen123.jpg', 1),
--   ('Zapatos casuales de ante', 'Zapatos casuales de ante para hombres', 79.99, 0.05, 50, 10, 5, 1, 'https://ejemplo.com/imagen124.jpg', 1),
--   ('Vestido de encaje largo', 'Vestido de encaje largo para ocasiones especiales', 129.99, 1, 30, 5, 3, 4, 'https://ejemplo.com/imagen125.jpg', 2),
--   ('Jeans desgastados', 'Jeans desgastados de estilo moderno para hombres', 59.99, 0.1, 70, 15, 5, 1, 'https://ejemplo.com/imagen126.jpg', 2),
--   ('Blusa de seda con lazo', 'Blusa de seda con lazo en el cuello', 49.99, 1, 80, 20, 10, 2, 'https://ejemplo.com/imagen127.jpg', 3),
--   ('Chaqueta deportiva transpirable', 'Chaqueta deportiva transpirable para hombres', 79.99, 0.15, 100, 30, 15, 3, 'https://ejemplo.com/imagen128.jpg', 3),
--   ('Vestido de noche elegante con abertura', 'Vestido de noche elegante con abertura lateral', 129.99, 1, 30, 5, 3, 4, 'https://ejemplo.com/imagen129.jpg', 1),
--   ('Camiseta básica de manga larga', 'Camiseta básica de manga larga para hombres', 34.99, 1, 70, 15, 5, 1, 'https://ejemplo.com/imagen130.jpg', 1),
--   ('Sandalias de plataforma', 'Sandalias de plataforma para mujeres', 39.99, 0.05, 80, 20, 10, 3, 'https://ejemplo.com/imagen131.jpg', 2),
--   ('Vestido corto de fiesta', 'Vestido corto de fiesta para ocasiones especiales', 99.99, 1, 30, 5, 3, 4, 'https://ejemplo.com/imagen132.jpg', 2),
--   ('Jersey de punto con cuello redondo', 'Jersey de punto con cuello redondo para hombres', 49.99, 0.1, 50, 10, 5, 5, 'https://ejemplo.com/imagen133.jpg', 1);
