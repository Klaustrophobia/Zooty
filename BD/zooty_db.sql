-- =====================================================
-- TABLA: usuarios (dueños de mascotas)
-- =====================================================
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    correo VARCHAR(255) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    url_avatar TEXT,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: mascotas
-- =====================================================
CREATE TABLE mascotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(100),
    fecha_nacimiento DATE,
    peso DECIMAL(5,2),
    color VARCHAR(50),
    url_foto TEXT,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: historial_medico
-- =====================================================
CREATE TABLE historial_medico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mascota_id UUID NOT NULL REFERENCES mascotas(id) ON DELETE CASCADE,
    tipo_registro VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    fecha_proximo_vencimiento DATE,
    nombre_veterinario VARCHAR(255),
    urls_documentos TEXT[],
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: veterinarios
-- =====================================================
CREATE TABLE veterinarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_negocio VARCHAR(255) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    direccion TEXT NOT NULL,
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    descripcion TEXT,
    url_logo TEXT,
    url_banner TEXT,
    atiende_24h BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    promedio_calificacion DECIMAL(3,2) DEFAULT 0,
    total_calificaciones INTEGER DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: servicios
-- =====================================================
CREATE TABLE servicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    veterinario_id UUID NOT NULL REFERENCES veterinarios(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    descripcion TEXT,
    duracion_minutos INTEGER DEFAULT 30,
    precio DECIMAL(10,2) NOT NULL,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: citas
-- =====================================================
CREATE TABLE citas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    mascota_id UUID NOT NULL REFERENCES mascotas(id) ON DELETE CASCADE,
    servicio_id UUID NOT NULL REFERENCES servicios(id) ON DELETE CASCADE,
    veterinario_id UUID NOT NULL REFERENCES veterinarios(id) ON DELETE CASCADE,
    fecha_cita TIMESTAMP NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    notas TEXT,
    monto_total DECIMAL(10,2) NOT NULL,
    estado_pago VARCHAR(50) DEFAULT 'pendiente',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: pagos
-- =====================================================
CREATE TABLE pagos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cita_id UUID NOT NULL REFERENCES citas(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL,
    monto_comision DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    id_transaccion VARCHAR(255),
    estado VARCHAR(50) DEFAULT 'pendiente',
    fecha_pago TIMESTAMP,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: reseñas
-- =====================================================
CREATE TABLE resenas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cita_id UUID NOT NULL REFERENCES citas(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    veterinario_id UUID NOT NULL REFERENCES veterinarios(id) ON DELETE CASCADE,
    calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    es_verificada BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES
-- =====================================================
CREATE INDEX idx_mascotas_usuario_id ON mascotas(usuario_id);
CREATE INDEX idx_historial_medico_mascota_id ON historial_medico(mascota_id);
CREATE INDEX idx_historial_medico_fecha_proximo_vencimiento ON historial_medico(fecha_proximo_vencimiento);
CREATE INDEX idx_citas_usuario_id ON citas(usuario_id);
CREATE INDEX idx_citas_mascota_id ON citas(mascota_id);
CREATE INDEX idx_citas_veterinario_id ON citas(veterinario_id);
CREATE INDEX idx_citas_fecha_cita ON citas(fecha_cita);
CREATE INDEX idx_citas_estado ON citas(estado);
CREATE INDEX idx_servicios_veterinario_id ON servicios(veterinario_id);
CREATE INDEX idx_pagos_cita_id ON pagos(cita_id);
CREATE INDEX idx_resenas_veterinario_id ON resenas(veterinario_id);
CREATE INDEX idx_veterinarios_ubicacion ON veterinarios(latitud, longitud);

-- =====================================================
-- TRIGGER para actualizar actualizado_en automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION actualizar_actualizado_en_columna()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER actualizar_usuarios_actualizado_en BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION actualizar_actualizado_en_columna();
CREATE TRIGGER actualizar_mascotas_actualizado_en BEFORE UPDATE ON mascotas FOR EACH ROW EXECUTE FUNCTION actualizar_actualizado_en_columna();
CREATE TRIGGER actualizar_historial_medico_actualizado_en BEFORE UPDATE ON historial_medico FOR EACH ROW EXECUTE FUNCTION actualizar_actualizado_en_columna();
CREATE TRIGGER actualizar_veterinarios_actualizado_en BEFORE UPDATE ON veterinarios FOR EACH ROW EXECUTE FUNCTION actualizar_actualizado_en_columna();
CREATE TRIGGER actualizar_servicios_actualizado_en BEFORE UPDATE ON servicios FOR EACH ROW EXECUTE FUNCTION actualizar_actualizado_en_columna();
CREATE TRIGGER actualizar_citas_actualizado_en BEFORE UPDATE ON citas FOR EACH ROW EXECUTE FUNCTION actualizar_actualizado_en_columna();
CREATE TRIGGER actualizar_pagos_actualizado_en BEFORE UPDATE ON pagos FOR EACH ROW EXECUTE FUNCTION actualizar_actualizado_en_columna();
CREATE TRIGGER actualizar_resenas_actualizado_en BEFORE UPDATE ON resenas FOR EACH ROW EXECUTE FUNCTION actualizar_actualizado_en_columna();

-- =====================================================
-- FUNCIÓN para actualizar promedio de calificación del veterinario
-- =====================================================
CREATE OR REPLACE FUNCTION actualizar_promedio_veterinario()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE veterinarios
    SET 
        promedio_calificacion = (
            SELECT COALESCE(AVG(calificacion), 0)
            FROM resenas
            WHERE veterinario_id = NEW.veterinario_id
            AND es_verificada = true
        ),
        total_calificaciones = (
            SELECT COUNT(*)
            FROM resenas
            WHERE veterinario_id = NEW.veterinario_id
            AND es_verificada = true
        )
    WHERE id = NEW.veterinario_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER actualizar_promedio_veterinario_despues_resena
AFTER INSERT OR UPDATE OR DELETE ON resenas
FOR EACH ROW EXECUTE FUNCTION actualizar_promedio_veterinario();