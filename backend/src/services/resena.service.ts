import { ResenaRepository } from "@/repositories/resena.repository";
import { VeterinarioRepository } from "@/repositories/veterinario.repository";
import { CitaRepository } from "@/repositories/cita.repository";
import { Resena } from "@/entities/Resena";

export class ResenaService {
  private resenaRepository: ResenaRepository;
  private veterinarioRepository: VeterinarioRepository;
  private citaRepository: CitaRepository;

  constructor() {
    this.resenaRepository = new ResenaRepository();
    this.veterinarioRepository = new VeterinarioRepository();
    this.citaRepository = new CitaRepository();
  }

  async createResena(resenaData: {
    cita_id: string;
    usuario_id: string;
    veterinario_id: string;
    calificacion: number;
    comentario?: string;
  }): Promise<Resena> {
    const cita = await this.citaRepository.findById(resenaData.cita_id);
    if (!cita) {
      throw new Error("Cita no encontrada");
    }

    if (cita.estado !== "completada") {
      throw new Error("Solo se pueden reseñar citas completadas");
    }

    const resenaExistente = await this.resenaRepository.findByCitaId(resenaData.cita_id);
    if (resenaExistente) {
      throw new Error("Ya existe una reseña para esta cita");
    }

    const resena = await this.resenaRepository.create({
      ...resenaData,
      es_verificada: true
    });

    const { promedio, total } = await this.resenaRepository.getPromedioByVeterinarioId(resenaData.veterinario_id);
    await this.veterinarioRepository.updatePromedio(resenaData.veterinario_id, promedio, total);

    return resena;
  }

  async getResenaById(id: string): Promise<Resena | null> {
    return await this.resenaRepository.findById(id);
  }

  async getResenasByVeterinarioId(veterinarioId: string): Promise<Resena[]> {
    return await this.resenaRepository.findByVeterinarioId(veterinarioId);
  }

  async getResenasByUsuarioId(usuarioId: string): Promise<Resena[]> {
    return await this.resenaRepository.findByUsuarioId(usuarioId);
  }

  async getAllResenas(): Promise<Resena[]> {
    return await this.resenaRepository.findAll();
  }

  async updateResena(id: string, updateData: Partial<Resena>): Promise<Resena | null> {
    const resena = await this.resenaRepository.findById(id);
    if (!resena) {
      throw new Error("Reseña no encontrada");
    }

    await this.resenaRepository.update(id, updateData);

    const { promedio, total } = await this.resenaRepository.getPromedioByVeterinarioId(resena.veterinario_id);
    await this.veterinarioRepository.updatePromedio(resena.veterinario_id, promedio, total);

    return await this.resenaRepository.findById(id);
  }

  async deleteResena(id: string): Promise<boolean> {
    const resena = await this.resenaRepository.findById(id);
    if (!resena) {
      throw new Error("Reseña no encontrada");
    }

    const deleted = await this.resenaRepository.delete(id);

    const { promedio, total } = await this.resenaRepository.getPromedioByVeterinarioId(resena.veterinario_id);
    await this.veterinarioRepository.updatePromedio(resena.veterinario_id, promedio, total);

    return deleted;
  }
}