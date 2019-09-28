CREATE TABLE `competencias`.`competencia` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`));

INSERT INTO `competencia` (`id`,`nombre`) VALUES (1,'Mejor pelicula de acción');
INSERT INTO `competencia` (`id`,`nombre`) VALUES (2,'Mejor pelicula del año 2007');
INSERT INTO `competencia` (`id`,`nombre`) VALUES (3,'Pelicula para llorar de risa');
INSERT INTO `competencia` (`id`,`nombre`) VALUES (4,'Mejor pochoclera');
INSERT INTO `competencia` (`id`,`nombre`) VALUES (5,'Pelicula más dramática');
INSERT INTO `competencia` (`id`,`nombre`) VALUES (6,'Mejores efectos en cs ficción');
INSERT INTO `competencia` (`id`,`nombre`) VALUES (7,'Mejor documental');
INSERT INTO `competencia` (`id`,`nombre`) VALUES (8,'Mejor de mejores');


CREATE TABLE `competencias`.`voto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_pelicula` INT NOT NULL,
  `id_competencia` INT NOT NULL,
  `cantidad_votos` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `id_pelicula_idx` (`id_pelicula` ASC),
  INDEX `id_competencia_idx` (`id_competencia` ASC));

INSERT INTO voto (id_pelicula,id_competencia,cantidad_votos) 
SELECT p.id, 1, 0 
FROM pelicula p    
INNER JOIN genero g ON p.genero_id = g.id
WHERE p.genero_id = 1 
LIMIT 10;

INSERT INTO voto (id_pelicula,id_competencia,cantidad_votos) 
SELECT p.id, 2, 0 
FROM pelicula p    
WHERE year(p.fecha_lanzamiento) = 2007 
LIMIT 10;

INSERT INTO voto (id_pelicula,id_competencia,cantidad_votos) 
SELECT p.id,3,0
FROM pelicula p    
WHERE genero_id = 5
LIMIT 10;

INSERT INTO voto (id_pelicula,id_competencia,cantidad_votos) 
SELECT p.id,4,0
FROM pelicula p    
WHERE puntuacion <= 5
LIMIT 10;

INSERT INTO voto (id_pelicula,id_competencia,cantidad_votos) 
SELECT p.id,5,0
FROM pelicula p    
WHERE genero_id = 8
LIMIT 10;

INSERT INTO voto (id_pelicula,id_competencia,cantidad_votos) 
SELECT p.id,6,0
FROM pelicula p    
WHERE genero_id = 13
LIMIT 10;

INSERT INTO voto (id_pelicula,id_competencia,cantidad_votos) 
SELECT p.id,7,0
FROM pelicula p    
WHERE genero_id = 7
LIMIT 10;

INSERT INTO voto (id_pelicula,id_competencia,cantidad_votos) 
SELECT p.id,8,0
FROM pelicula p    
WHERE puntuacion > 8
LIMIT 10;

ALTER TABLE `competencias`.`competencia` 
ADD COLUMN `genero_id` INT UNSIGNED NULL AFTER `nombre`,
ADD COLUMN `actor_id` INT UNSIGNED NULL AFTER `genero_id`,
ADD COLUMN `director_id` INT UNSIGNED NULL AFTER `actor_id`,
ADD INDEX `genero_id_idx` (`genero_id` ASC) ,
ADD INDEX `actor_id_idx` (`actor_id` ASC) ,
ADD INDEX `director_id_idx` (`director_id` ASC) ;

ALTER TABLE `competencias`.`competencia` 
ADD CONSTRAINT `genero_id`
  FOREIGN KEY (`genero_id`)
  REFERENCES `competencias`.`genero` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `actor_id`
  FOREIGN KEY (`actor_id`)
  REFERENCES `competencias`.`actor` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `director_id`
  FOREIGN KEY (`director_id`)
  REFERENCES `competencias`.`director` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
