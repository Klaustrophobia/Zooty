SELECT * FROM usuarios;
SELECT * FROM veterinarios;
SELECT * FROM mascotas;
SELECT * FROM servicios;
SELECT * FROM especialidades;
SELECT * FROM veterinario_especialidades;
	
SELECT 
    v.id,
    v.nombre_negocio,
    v.promedio_calificacion,

    -- Distancia en KM
    (
        6371 * acos(
            cos(radians(:user_lat)) *
            cos(radians(v.latitud)) *
            cos(radians(v.longitud) - radians(:user_lng)) +
            sin(radians(:user_lat)) *
            sin(radians(v.latitud))
        )
    ) AS distancia

FROM veterinarios v
ORDER BY distancia ASC;

SELECT 
    v.id,
    v.nombre_negocio,
    v.promedio_calificacion,

    (
        6371 * acos(
            cos(radians($1)) *
            cos(radians(v.latitud)) *
            cos(radians(v.longitud) - radians($2)) +
            sin(radians($1)) *
            sin(radians(v.latitud))
        )
    ) AS distancia

FROM veterinarios v
ORDER BY distancia ASC;

INSERT INTO especialidades (nombre, descripcion) VALUES
('Veterinaria General', 'Atención médica general para mascotas'),
('Cirugía', 'Procedimientos quirúrgicos en animales'),
('Peluquería Canina', 'Estética, baño y corte de mascotas'),
('Guardería', 'Cuidado temporal de mascotas'),
('Paseador', 'Servicios de paseo y ejercicio'),
('Vacunación', 'Aplicación de vacunas preventivas'),
('Dermatología', 'Tratamiento de piel y alergias'),
('Odontología', 'Cuidado dental para mascotas'),
('Emergencias 24h', 'Atención médica de urgencia'),
('Nutrición Animal', 'Planes de alimentación y dieta');
SELECT * FROM especialidades;

-- Veterinario 1
INSERT INTO veterinario_especialidades (veterinario_id, especialidad_id)
SELECT * FROM veterinarios WHERE nombre_negocio = 'Hospital Mascotas Felices';
SELECT id FROM especialidades WHERE nombre IN 
('Veterinaria General', 'Vacunación', 'Emergencias 24h');
INSERT INTO veterinario_especialidades (veterinario_id, especialidad_id)
VALUES
((SELECT id FROM veterinarios WHERE nombre_negocio = 'Hospital Mascotas Felices'), (SELECT id FROM especialidades WHERE nombre = 'Veterinaria General')),
((SELECT id FROM veterinarios WHERE nombre_negocio = 'Hospital Mascotas Felices'), (SELECT id FROM especialidades WHERE nombre = 'Vacunación')),

((SELECT id FROM veterinarios WHERE nombre_negocio = 'Clínica VetSalud'), (SELECT id FROM especialidades WHERE nombre = 'Peluquería Canina')),
((SELECT id FROM veterinarios WHERE nombre_negocio = 'Clínica VetSalud'), (SELECT id FROM especialidades WHERE nombre = 'Guardería'));
SELECT * FROM veterinario_especialidades;