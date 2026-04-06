export interface CreateResenaDTO {
  cita_id: string;
  usuario_id: string;
  veterinario_id: string;
  calificacion: number;
  comentario?: string;
}

export interface UpdateResenaDTO {
  calificacion?: number;
  comentario?: string;
  es_verificada?: boolean;
}

export interface ResenaResponseDTO {
  id: string;
  cita_id: string;
  usuario_id: string;
  veterinario_id: string;
  calificacion: number;
  comentario: string | null;
  es_verificada: boolean;
  creado_en: Date;
  actualizado_en: Date;
}