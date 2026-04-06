export interface CreateHistorialMedicoDTO {
  mascota_id: string;
  tipo_registro: string;
  titulo: string;
  descripcion?: string;
  fecha: string;
  fecha_proximo_vencimiento?: string;
  nombre_veterinario?: string;
  urls_documentos?: string[];
}

export interface UpdateHistorialMedicoDTO {
  tipo_registro?: string;
  titulo?: string;
  descripcion?: string;
  fecha?: string;
  fecha_proximo_vencimiento?: string;
  nombre_veterinario?: string;
  urls_documentos?: string[];
}

export interface HistorialMedicoResponseDTO {
  id: string;
  mascota_id: string;
  tipo_registro: string;
  titulo: string;
  descripcion: string | null;
  fecha: Date;
  fecha_proximo_vencimiento: Date | null;
  nombre_veterinario: string | null;
  urls_documentos: string[] | null;
  creado_en: Date;
  actualizado_en: Date;
}