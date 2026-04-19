-- =====================================================
-- SCRIPT DML: Datos de Prueba (PetCare)
-- =====================================================

-- 1. Usuarios (Dueños)
INSERT INTO usuarios (correo, contrasena, nombre_completo, telefono, url_avatar) 
VALUES 
('juan.perez@email.com', 'hash_password_123', 'Juan Pérez', '+525512345678', 'https://avatar.com/juan.jpg'),
('maria.garcia@email.com', 'hash_password_456', 'Maria Garcia', '+525598765432', 'https://avatar.com/maria.jpg');

-- 2. Mascotas
INSERT INTO mascotas (usuario_id, nombre, especie, raza, fecha_nacimiento, peso, color)
VALUES 
((SELECT id FROM usuarios WHERE correo = 'juan.perez@email.com'), 'Firulais', 'Perro', 'Golden Retriever', '2021-05-15', 30.5, 'Dorado'),
((SELECT id FROM usuarios WHERE correo = 'juan.perez@email.com'), 'Michi', 'Gato', 'Siamés', '2022-10-01', 4.2, 'Blanco/Café'),
((SELECT id FROM usuarios WHERE correo = 'maria.garcia@email.com'), 'Luna', 'Perro', 'Border Collie', '2020-01-20', 18.0, 'Negro/Blanco');

-- 3. Historial Médico (Registros previos)
INSERT INTO historial_medico (mascota_id, tipo_registro, titulo, descripcion, fecha, fecha_proximo_vencimiento, nombre_veterinario)
VALUES 
((SELECT id FROM mascotas WHERE nombre = 'Firulais'), 'Vacuna', 'Rabia Anual', 'Refuerzo anual contra la rabia', '2023-04-01', '2024-04-01', 'Dr. Smith'),
((SELECT id FROM mascotas WHERE nombre = 'Michi'), 'Desparasitación', 'Control Interno', 'Tableta antiparasitaria', '2024-02-15', '2024-05-15', 'Dra. Casas');

-- 4. Veterinarios (Negocios)
INSERT INTO veterinarios (nombre_negocio, correo, telefono, direccion, latitud, longitud, atiende_24h, descripcion)
VALUES 
('Clínica VetSalud', 'contacto@vetsalud.com', '555-0101', 'Av. Insurgentes 123, CDMX', 19.4326, -99.1332, true, 'Atención integral para pequeñas especies.'),
('Hospital Mascotas Felices', 'admin@mascotasfelices.com', '555-0202', 'Calle Reforma 45, CDMX', 19.4270, -99.1676, false, 'Especialistas en cirugía y ortopedia.');

-- 5. Servicios (Ofrecidos por las veterinarias)
INSERT INTO servicios (veterinario_id, nombre, categoria, descripcion, duracion_minutos, precio)
VALUES 
((SELECT id FROM veterinarios WHERE nombre_negocio = 'Clínica VetSalud'), 'Veterinario', 'Salud y vacunas', 'Revisión preventiva estándar', 30, 450.00),
((SELECT id FROM veterinarios WHERE nombre_negocio = 'Clínica VetSalud'), 'Peluquería', 'Estética animal', 'Cuidado de pelo, oidos y uñas de mascotas', 20, 800.00),
((SELECT id FROM veterinarios WHERE nombre_negocio = 'Hospital Mascotas Felices'), 'Guardería', 'Cuidado diario', 'Cuidado de animales dentro de nuestras instalaciones', 60, 1200.00),
((SELECT id FROM veterinarios WHERE nombre_negocio = 'Hospital Mascotas Felices'), 'Paseador', 'Ejercicio activo', 'Cuidado de la salud cardiovascular de la mascota, entre otras', 30, 800.00);

-- 6. Citas
INSERT INTO citas (usuario_id, mascota_id, servicio_id, veterinario_id, fecha_cita, estado, monto_total)
VALUES 
(
    (SELECT id FROM usuarios WHERE correo = 'juan.perez@email.com'),
    (SELECT id FROM mascotas WHERE nombre = 'Rocket'),
    (SELECT id FROM servicios WHERE nombre = 'Consulta General' LIMIT 1),
    (SELECT id FROM veterinarios WHERE nombre_negocio = 'Clínica VetSalud'),
    '2024-05-20 10:00:00',
    'completada',
    450.00
);

-- 7. Pagos
INSERT INTO pagos (cita_id, usuario_id, monto, monto_comision, metodo_pago, id_transaccion, estado, fecha_pago)
VALUES 
(
    (SELECT id FROM citas WHERE estado = 'completada' LIMIT 1),
    (SELECT id FROM usuarios WHERE correo = 'juan.perez@email.com'),
    450.00,
    45.00,
    'Tarjeta de Crédito',
    'TXN-99887766',
    'completado',
    CURRENT_TIMESTAMP
);

-- 8. Reseñas
INSERT INTO resenas (cita_id, usuario_id, veterinario_id, calificacion, comentario)
VALUES 
(
    (SELECT id FROM citas WHERE estado = 'completada' LIMIT 1),
    (SELECT id FROM usuarios WHERE correo = 'juan.perez@email.com'),
    (SELECT id FROM veterinarios WHERE nombre_negocio = 'Clínica VetSalud'),
    5,
    'Excelente atención, muy profesionales con mi perro.'
);

-- 9. Especialidades
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

-- 10. Relación Veterinarios-Especialidades
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