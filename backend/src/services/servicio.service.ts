import { ServicioRepository } from "@/repositories/servicio.repository";
import { Servicio } from "@/entities/Servicio";

export class ServicioService {
  private servicioRepository: ServicioRepository;

  constructor() {
    this.servicioRepository = new ServicioRepository();
  }

  async createServicio(servicioData: {
    veterinario_id: string;
    nombre: string;
    categoria: string;
    descripcion?: string;
    duracion_minutos?: number;
    precio: number;
  }): Promise<Servicio> {
    return await this.servicioRepository.create({
      ...servicioData,
      activo: true
    });
  }

  async getAllServicios(): Promise<Servicio[]> {
    return await this.servicioRepository.findAll();
  }

  async getServicioById(id: string): Promise<Servicio | null> {
    return await this.servicioRepository.findById(id);
  }

  async getServiciosByVeterinarioId(veterinarioId: string): Promise<Servicio[]> {
    return await this.servicioRepository.findByVeterinarioId(veterinarioId);
  }

  async updateServicio(id: string, updateData: Partial<Servicio>): Promise<Servicio | null> {
    await this.servicioRepository.update(id, updateData);
    return await this.servicioRepository.findById(id);
  }

  async deleteServicio(id: string): Promise<boolean> {
    return await this.servicioRepository.delete(id);
  }
}