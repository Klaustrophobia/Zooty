import { PagoRepository } from "@/repositories/pago.repository";
import { CitaRepository } from "@/repositories/cita.repository";
import { Pago } from "@/entities/Pago";

export class PagoService {
  private pagoRepository: PagoRepository;
  private citaRepository: CitaRepository;

  constructor() {
    this.pagoRepository = new PagoRepository();
    this.citaRepository = new CitaRepository();
  }

  async getPagoById(id: string): Promise<Pago | null> {
    return await this.pagoRepository.findById(id);
  }

  async getPagosByUsuarioId(usuarioId: string): Promise<Pago[]> {
    return await this.pagoRepository.findByUsuarioId(usuarioId);
  }

  async getPagoByCitaId(citaId: string): Promise<Pago | null> {
    return await this.pagoRepository.findByCitaId(citaId);
  }

  async getAllPagos(): Promise<Pago[]> {
    return await this.pagoRepository.findAll();
  }

  async updatePago(id: string, updateData: Partial<Pago>): Promise<Pago | null> {
    await this.pagoRepository.update(id, updateData);
    return await this.pagoRepository.findById(id);
  }

  async deletePago(id: string): Promise<boolean> {
    return await this.pagoRepository.delete(id);
  }
}