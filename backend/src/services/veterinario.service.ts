import { VeterinarioRepository } from "@/repositories/veterinario.repository";
import { Veterinario } from "@/entities/Veterinario";

export class VeterinarioService {
  private veterinarioRepository: VeterinarioRepository;

  constructor() {
    this.veterinarioRepository = new VeterinarioRepository();
  }

  async createVeterinario(veterinarioData: {
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
  }): Promise<Veterinario> {
    return await this.veterinarioRepository.create({
      ...veterinarioData,
      activo: true,
      promedio_calificacion: 0,
      total_calificaciones: 0
    });
  }

  async getAllVeterinarios(): Promise<Veterinario[]> {
    return await this.veterinarioRepository.findAll();
  }

  async getVeterinarioById(id: string): Promise<Veterinario | null> {
    return await this.veterinarioRepository.findById(id);
  }

  async getVeterinariosCercanos(latitud: number, longitud: number, radioKm: number = 10): Promise<Veterinario[]> {
    return await this.veterinarioRepository.findCercanos(latitud, longitud, radioKm);
  }

  async updateVeterinario(id: string, updateData: Partial<Veterinario>): Promise<Veterinario | null> {
    await this.veterinarioRepository.update(id, updateData);
    return await this.veterinarioRepository.findById(id);
  }

  async deleteVeterinario(id: string): Promise<boolean> {
    return await this.veterinarioRepository.delete(id);
  }
}