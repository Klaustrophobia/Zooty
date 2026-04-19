export interface CreateVeterinarioDTO {
  nombre_negocio: string;
  correo: string;
  telefono: string;
  direccion: string;
  latitud?: number;
  longitud?: number;
  descripcion?: string;
  url_logo?: string;
  url_banner?: string;
  atiende_24h?: boolean;
}

export interface UpdateVeterinarioDTO {
  nombre_negocio?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  descripcion?: string;
  url_logo?: string;
  url_banner?: string;
  atiende_24h?: boolean;
  activo?: boolean;
}

export interface VeterinarioResponseDTO {
  id: string;
  nombre_negocio: string;
  correo: string;
  telefono: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
  descripcion: string | null;
  url_logo: string | null;
  url_banner: string | null;
  atiende_24h: boolean;
  activo: boolean;
  promedio_calificacion: number;
  total_calificaciones: number;
  creado_en: Date;
  actualizado_en: Date;
}

export interface VeterinariosCercanosDTO {
  latitud: number;
  longitud: number;
  radio_km?: number;
  
}

export interface VeterinarioDTO {
  id: string;
  nombre_negocio: string;
  promedio_calificacion: number;
  specialty: string;
  latitud: number | null;
  longitud: number | null;
  distance?: string | null;
}