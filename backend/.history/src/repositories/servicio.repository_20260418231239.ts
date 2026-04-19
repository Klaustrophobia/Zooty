import { AppDataSource, initializeDatabase } from "@/lib/db";
import { Servicio } from "@/entities/Servicio";
import { Repository } from "typeorm";

export class ServicioRepository {
  private repository: Repository<Servicio>;

  constructor() {
    this.repository = AppDataSource.getRepository(Servicio);
  }

  private async initialize() {
    await initializeDatabase();
  }

  async create(servicioData: Partial<Servicio>): Promise<Servicio> {
    await this.initialize();
    const servicio = this.repository.create(servicioData);
    return await this.repository.save(servicio);
  }

  async findByVeterinarioId(veterinarioId: string): Promise<Servicio[]> {
    await this.initialize();
    return await this.repository.find({
      where: { id: veterinarioId, activo: true },
      order: { creado_en: "DESC" }
    });
  }

  async findById(id: string): Promise<Servicio | null> {
    await this.initialize();
    return await this.repository.findOne({
      where: { id }
    });
  }

  async findAll(): Promise<Servicio[]> {
    await this.initialize();
    return await this.repository.find({
      where: { activo: true },
      order: { creado_en: "DESC" }
    });
  }

  async update(id: string, updateData: Partial<Servicio>): Promise<void> {
    await this.initialize();
    await this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    await this.initialize();
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}