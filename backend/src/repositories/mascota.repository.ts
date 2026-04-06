import { AppDataSource, initializeDatabase } from "@/lib/db";
import { Mascota } from "@/entities/Mascota";
import { Repository } from "typeorm";

export class MascotaRepository {
  private repository: Repository<Mascota>;

  constructor() {
    this.repository = AppDataSource.getRepository(Mascota);
  }

  private async initialize() {
    await initializeDatabase();
  }

  async create(mascotaData: Partial<Mascota>): Promise<Mascota> {
    await this.initialize();
    const mascota = this.repository.create(mascotaData);
    return await this.repository.save(mascota);
  }

  async findAll(): Promise<Mascota[]> {
    await this.initialize();
    return await this.repository.find({
      order: { creado_en: "DESC" }
    });
  }

  async findById(id: string): Promise<Mascota | null> {
    await this.initialize();
    return await this.repository.findOne({
      where: { id }
    });
  }

  async findByUsuarioId(usuarioId: string): Promise<Mascota[]> {
    await this.initialize();
    return await this.repository.find({
      where: { usuario_id: usuarioId, activo: true },
      order: { creado_en: "DESC" }
    });
  }

  async update(id: string, updateData: Partial<Mascota>): Promise<void> {
    await this.initialize();
    await this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    await this.initialize();
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}