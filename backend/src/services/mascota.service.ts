import { MascotaRepository } from "@/repositories/mascota.repository";
import { Mascota } from "@/entities/Mascota";

export class MascotaService {
  private mascotaRepository: MascotaRepository;

  constructor() {
    this.mascotaRepository = new MascotaRepository();
  }

  async createMascota(mascotaData: {
    usuario_id: string;
    nombre: string;
    especie: string;
    raza?: string;
    fecha_nacimiento?: Date;
    peso?: number;
    color?: string;
    url_foto?: string;
  }): Promise<Mascota> {
    return await this.mascotaRepository.create({
      ...mascotaData,
      activo: true
    });
  }

  async getAllMascotas(): Promise<Mascota[]> {
    return await this.mascotaRepository.findAll();
  }

  async getMascotaById(id: string): Promise<Mascota | null> {
    return await this.mascotaRepository.findById(id);
  }

  async getMascotasByUsuarioId(usuarioId: string): Promise<Mascota[]> {
    return await this.mascotaRepository.findByUsuarioId(usuarioId);
  }

  async updateMascota(id: string, updateData: Partial<Mascota>): Promise<Mascota | null> {
    await this.mascotaRepository.update(id, updateData);
    return await this.mascotaRepository.findById(id);
  }

  async deleteMascota(id: string): Promise<boolean> {
    return await this.mascotaRepository.delete(id);
  }
}