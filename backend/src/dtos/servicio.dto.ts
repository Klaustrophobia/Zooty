export interface CreateServicioDTO {
  veterinario_id: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  duracion_minutos?: number;
  precio: number;
}

export interface UpdateServicioDTO {
  nombre?: string;
  categoria?: string;
  descripcion?: string;
  duracion_minutos?: number;
  precio?: number;
  activo?: boolean;
}

export interface ServicioResponseDTO {
  id: string;
  veterinario_id: string;
  nombre: string;
  categoria: string;
  descripcion: string | null;
  duracion_minutos: number;
  precio: number;
  activo: boolean;
  creado_en: Date;
  actualizado_en: Date;
}