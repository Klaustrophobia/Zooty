export interface CreateCitaDTO {
  usuario_id: string;
  mascota_id: string;
  servicio_id: string;
  veterinario_id: string;
  fecha_cita: string;
  notas?: string;
}

export interface UpdateCitaDTO {
  fecha_cita?: string;
  estado?: string;
  notas?: string;
  estado_pago?: string;
}

export interface CitaResponseDTO {
  id: string;
  usuario_id: string;
  mascota_id: string;
  servicio_id: string;
  veterinario_id: string;
  fecha_cita: Date;
  estado: string;
  notas: string | null;
  monto_total: number;
  estado_pago: string;
  creado_en: Date;
  actualizado_en: Date;
}

export interface CitaCompletaResponseDTO extends CitaResponseDTO {
  usuario: {
    id: string;
    nombre_completo: string;
    correo: string;
  };
  mascota: {
    id: string;
    nombre: string;
    especie: string;
    raza: string | null;
  };
  servicio: {
    id: string;
    nombre: string;
    categoria: string;
    precio: number;
  };
  veterinario: {
    id: string;
    nombre_negocio: string;
    direccion: string;
    telefono: string;
    promedio_calificacion: number;
  };
}