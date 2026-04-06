export interface CreateMascotaDTO {
  usuario_id: string;
  nombre: string;
  especie: string;
  raza?: string;
  fecha_nacimiento?: string;
  peso?: number;
  color?: string;
  url_foto?: string;
}

export interface UpdateMascotaDTO {
  nombre?: string;
  especie?: string;
  raza?: string;
  fecha_nacimiento?: string;
  peso?: number;
  color?: string;
  url_foto?: string;
  activo?: boolean;
}

export interface MascotaResponseDTO {
  id: string;
  usuario_id: string;
  nombre: string;
  especie: string;
  raza: string | null;
  fecha_nacimiento: Date | null;
  peso: number | null;
  color: string | null;
  url_foto: string | null;
  activo: boolean;
  creado_en: Date;
  actualizado_en: Date;
}