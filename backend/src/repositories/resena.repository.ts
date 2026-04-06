import { AppDataSource, initializeDatabase } from "@/lib/db";
import { Resena } from "@/entities/Resena";
import { Repository } from "typeorm";

export class ResenaRepository {
  private repository: Repository<Resena>;

  constructor() {
    this.repository = AppDataSource.getRepository(Resena);
  }

  private async initialize() {
    await initializeDatabase();
  }

  async create(resenaData: Partial<Resena>): Promise<Resena> {
    await this.initialize();
    const resena = this.repository.create(resenaData);
    return await this.repository.save(resena);
  }

  async findById(id: string): Promise<Resena | null> {
    await this.initialize();
    return await this.repository.findOne({
      where: { id }
    });
  }

  async findByVeterinarioId(veterinarioId: string): Promise<Resena[]> {
    await this.initialize();
    return await this.repository.find({
      where: { veterinario_id: veterinarioId, es_verificada: true },
      order: { creado_en: "DESC" }
    });
  }

  async findByUsuarioId(usuarioId: string): Promise<Resena[]> {
    await this.initialize();
    return await this.repository.find({
      where: { usuario_id: usuarioId },
      order: { creado_en: "DESC" }
    });
  }

  async findByCitaId(citaId: string): Promise<Resena | null> {
    await this.initialize();
    return await this.repository.findOne({
      where: { cita_id: citaId }
    });
  }

  async findAll(): Promise<Resena[]> {
    await this.initialize();
    return await this.repository.find({
      order: { creado_en: "DESC" }
    });
  }

  async update(id: string, updateData: Partial<Resena>): Promise<void> {
    await this.initialize();
    await this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    await this.initialize();
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async getPromedioByVeterinarioId(veterinarioId: string): Promise<{ promedio: number; total: number }> {
    await this.initialize();
    const result = await this.repository
      .createQueryBuilder("resena")
      .select("AVG(resena.calificacion)", "promedio")
      .addSelect("COUNT(resena.id)", "total")
      .where("resena.veterinario_id = :veterinarioId", { veterinarioId })
      .andWhere("resena.es_verificada = true")
      .getRawOne();
    
    return {
      promedio: Number(result?.promedio) || 0,
      total: Number(result?.total) || 0
    };
  }
}