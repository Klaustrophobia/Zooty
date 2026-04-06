export interface CreateUsuarioDTO {
  correo: string;
  contrasena: string;
  nombre_completo: string;
  telefono?: string;
  url_avatar?: string;
}

export interface UpdateUsuarioDTO {
  correo?: string;
  contrasena?: string;
  nombre_completo?: string;
  telefono?: string;
  url_avatar?: string;
  activo?: boolean;
}

export interface UsuarioResponseDTO {
  id: string;
  correo: string;
  nombre_completo: string;
  telefono: string | null;
  url_avatar: string | null;
  activo: boolean;
  creado_en: Date;
  actualizado_en: Date;
}

export interface LoginDTO {
  correo: string;
  contrasena: string;
}