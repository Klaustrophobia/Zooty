import { HistorialMedicoRepository } from "@/repositories/historialMedico.repository";
import { HistorialMedico } from "@/entities/HistorialMedico";

export class HistorialMedicoService {
  private historialRepository: HistorialMedicoRepository;

  constructor() {
    this.historialRepository = new HistorialMedicoRepository();
  }

  async createRegistro(historialData: {
    mascota_id: string;
    tipo_registro: string;
    titulo: string;
    descripcion?: string;
    fecha: Date;
    fecha_proximo_vencimiento?: Date;
    nombre_veterinario?: string;
    urls_documentos?: string[];
  }): Promise<HistorialMedico> {
    return await this.historialRepository.create(historialData);
  }

  async getRegistrosByMascotaId(mascotaId: string): Promise<HistorialMedico[]> {
    return await this.historialRepository.findByMascotaId(mascotaId);
  }

  async getRegistroById(id: string): Promise<HistorialMedico | null> {
    return await this.historialRepository.findById(id);
  }

  async getProximosVencimientos(fecha: Date): Promise<HistorialMedico[]> {
    return await this.historialRepository.findProximosVencimientos(fecha);
  }

  async updateRegistro(id: string, updateData: Partial<HistorialMedico>): Promise<HistorialMedico | null> {
    await this.historialRepository.update(id, updateData);
    return await this.historialRepository.findById(id);
  }

  async deleteRegistro(id: string): Promise<boolean> {
    return await this.historialRepository.delete(id);
  }
}