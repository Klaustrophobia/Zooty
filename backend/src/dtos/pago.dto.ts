export interface CreatePagoDTO {
  cita_id: string;
  usuario_id: string;
  metodo_pago: string;
  id_transaccion?: string;
}

export interface UpdatePagoDTO {
  estado?: string;
  fecha_pago?: string;
  id_transaccion?: string;
}

export interface PagoResponseDTO {
  id: string;
  cita_id: string;
  usuario_id: string;
  monto: number;
  monto_comision: number;
  metodo_pago: string;
  id_transaccion: string | null;
  estado: string;
  fecha_pago: Date | null;
  creado_en: Date;
  actualizado_en: Date;
}