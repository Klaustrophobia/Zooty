SELECT 
    m.nombre AS mascota, 
    m.especie, 
    u.nombre_completo AS dueño, 
    u.correo
FROM mascotas m
JOIN usuarios u ON m.usuario_id = u.id
WHERE m.activo = true;

SELECT 
    h.fecha, 
    h.tipo_registro, 
    h.titulo, 
    h.descripcion, 
    h.nombre_veterinario
FROM historial_medico h
JOIN mascotas m ON h.mascota_id = m.id
WHERE m.nombre = 'Firulais'
ORDER BY h.fecha DESC;

SELECT 
    m.nombre AS mascota, 
    h.titulo AS tratamiento, 
    h.fecha_proximo_vencimiento,
    u.telefono AS contacto_dueño
FROM historial_medico h
JOIN mascotas m ON h.mascota_id = m.id
JOIN usuarios u ON m.usuario_id = u.id
WHERE h.fecha_proximo_vencimiento BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days');

SELECT 
    nombre_negocio, 
    promedio_calificacion, 
    total_calificaciones, 
    direccion
FROM veterinarios
WHERE activo = true
ORDER BY promedio_calificacion DESC, total_calificaciones DESC
LIMIT 5;

SELECT 
    c.fecha_cita, 
    u.nombre_completo AS cliente, 
    m.nombre AS mascota, 
    s.nombre AS servicio, 
    c.monto_total
FROM citas c
JOIN usuarios u ON c.usuario_id = u.id
JOIN mascotas m ON c.mascota_id = m.id
JOIN servicios s ON c.servicio_id = s.id
WHERE c.veterinario_id = (SELECT id FROM veterinarios WHERE nombre_negocio = 'Clínica VetSalud')
  AND c.fecha_cita::DATE = CURRENT_DATE
ORDER BY c.fecha_cita ASC;

SELECT 
    v.nombre_negocio,
    SUM(p.monto) AS ingresos_totales,
    SUM(p.monto_comision) AS total_comisiones_plataforma,
    COUNT(p.id) AS numero_pagos
FROM pagos p
JOIN citas c ON p.cita_id = c.id
JOIN veterinarios v ON c.veterinario_id = v.id
WHERE p.estado = 'completado'
GROUP BY v.nombre_negocio;

SELECT nombre_negocio, direccion, telefono
FROM veterinarios
WHERE latitud BETWEEN 19.40 AND 19.50
  AND longitud BETWEEN -99.20 AND -99.10
  AND atiende_24h = true;

SELECT 
    v.nombre_negocio, 
    r.calificacion, 
    r.comentario, 
    u.nombre_completo AS usuario
FROM resenas r
JOIN veterinarios v ON r.veterinario_id = v.id
JOIN usuarios u ON r.usuario_id = u.id
WHERE r.es_verificada = true
ORDER BY r.creado_en DESC
LIMIT 10;

SELECT * FROM mascotas;
SELECT * FROM usuarios;
SELECT * FROM pagos;