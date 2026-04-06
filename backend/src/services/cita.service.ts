import { CitaRepository } from "@/repositories/cita.repository";
import { ServicioRepository } from "@/repositories/servicio.repository";
import { PagoRepository } from "@/repositories/pago.repository";
import { Cita } from "@/entities/Cita";
import { Pago } from "@/entities/Pago";

const COMISION_PORCENTAJE = 15;

export class CitaService {
  private citaRepository: CitaRepository;
  private servicioRepository: ServicioRepository;
  private pagoRepository: PagoRepository;

  constructor() {
    this.citaRepository = new CitaRepository();
    this.servicioRepository = new ServicioRepository();
    this.pagoRepository = new PagoRepository();
  }

  async createCita(citaData: {
    usuario_id: string;
    mascota_id: string;
    servicio_id: string;
    veterinario_id: string;
    fecha_cita: Date;
    notas?: string;
  }): Promise<Cita> {
    const servicio = await this.servicioRepository.findById(citaData.servicio_id);
    if (!servicio) {
      throw new Error("Servicio no encontrado");
    }

    const disponible = await this.citaRepository.verificarDisponibilidad(
      citaData.veterinario_id,
      citaData.fecha_cita
    );
    if (!disponible) {
      throw new Error("La fecha no está disponible");
    }

    const cita = await this.citaRepository.create({
      ...citaData,
      monto_total: servicio.precio,
      estado: "pendiente",
      estado_pago: "pendiente"
    });

    return cita;
  }

  async procesarPago(citaId: string, metodoPago: string, idTransaccion?: string): Promise<Pago> {
    const cita = await this.citaRepository.findById(citaId);
    if (!cita) {
      throw new Error("Cita no encontrada");
    }

    if (cita.estado_pago === "pagado") {
      throw new Error("La cita ya fue pagada");
    }

    const montoComision = (cita.monto_total * COMISION_PORCENTAJE) / 100;

    const pago = await this.pagoRepository.create({
      cita_id: citaId,
      usuario_id: cita.usuario_id,
      monto: cita.monto_total,
      monto_comision: montoComision,
      metodo_pago: metodoPago,
      id_transaccion: idTransaccion || null,
      estado: "completado",
      fecha_pago: new Date()
    });

    await this.citaRepository.update(citaId, {
      estado_pago: "pagado",
      estado: "confirmada"
    });

    return pago;
  }

  async getAllCitas(): Promise<Cita[]> {
    return await this.citaRepository.findAll();
  }

  async getCitaById(id: string): Promise<Cita | null> {
    return await this.citaRepository.findById(id);
  }

  async getCitasByUsuario(usuarioId: string): Promise<Cita[]> {
    return await this.citaRepository.findByUsuarioId(usuarioId);
  }

  async getCitasByVeterinario(veterinarioId: string): Promise<Cita[]> {
    return await this.citaRepository.findByVeterinarioId(veterinarioId);
  }

  async getCitasByMascota(mascotaId: string): Promise<Cita[]> {
    return await this.citaRepository.findByMascotaId(mascotaId);
  }

  async getCitasProximas(fecha: Date): Promise<Cita[]> {
    return await this.citaRepository.findProximas(fecha);
  }

  async updateCita(id: string, updateData: Partial<Cita>): Promise<Cita | null> {
    await this.citaRepository.update(id, updateData);
    return await this.citaRepository.findById(id);
  }

  async cancelarCita(id: string): Promise<Cita | null> {
    const cita = await this.citaRepository.findById(id);
    if (!cita) {
      throw new Error("Cita no encontrada");
    }

    if (cita.estado === "completada") {
      throw new Error("No se puede cancelar una cita completada");
    }

    await this.citaRepository.update(id, { estado: "cancelada" });
    return await this.citaRepository.findById(id);
  }

  async deleteCita(id: string): Promise<boolean> {
    return await this.citaRepository.delete(id);
  }
}