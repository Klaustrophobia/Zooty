import { AppDataSource, initializeDatabase } from "@/lib/db";
import { HistorialMedico } from "@/entities/HistorialMedico";
import { Repository, LessThanOrEqual } from "typeorm";

export class HistorialMedicoRepository {
  private repository: Repository<HistorialMedico>;

  constructor() {
    this.repository = AppDataSource.getRepository(HistorialMedico);
  }

  private async initialize() {
    await initializeDatabase();
  }

  async create(historialData: Partial<HistorialMedico>): Promise<HistorialMedico> {
    await this.initialize();
    const historial = this.repository.create(historialData);
    return await this.repository.save(historial);
  }

  async findByMascotaId(mascotaId: string): Promise<HistorialMedico[]> {
    await this.initialize();
    return await this.repository.find({
      where: { mascota_id: mascotaId },
      order: { fecha: "DESC" }
    });
  }

  async findById(id: string): Promise<HistorialMedico | null> {
    await this.initialize();
    return await this.repository.findOne({
      where: { id }
    });
  }

  async findProximosVencimientos(fecha: Date): Promise<HistorialMedico[]> {
    await this.initialize();
    return await this.repository.find({
      where: {
        fecha_proximo_vencimiento: LessThanOrEqual(fecha)
      },
      order: { fecha_proximo_vencimiento: "ASC" }
    });
  }

  async update(id: string, updateData: Partial<HistorialMedico>): Promise<void> {
    await this.initialize();
    await this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    await this.initialize();
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}