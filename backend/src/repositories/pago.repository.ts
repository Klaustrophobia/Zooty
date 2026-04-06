import { AppDataSource, initializeDatabase } from "@/lib/db";
import { Pago } from "@/entities/Pago";
import { Repository } from "typeorm";

export class PagoRepository {
  private repository: Repository<Pago>;

  constructor() {
    this.repository = AppDataSource.getRepository(Pago);
  }

  private async initialize() {
    await initializeDatabase();
  }

  async create(pagoData: Partial<Pago>): Promise<Pago> {
    await this.initialize();
    const pago = this.repository.create(pagoData);
    return await this.repository.save(pago);
  }

  async findById(id: string): Promise<Pago | null> {
    await this.initialize();
    return await this.repository.findOne({
      where: { id }
    });
  }

  async findByUsuarioId(usuarioId: string): Promise<Pago[]> {
    await this.initialize();
    return await this.repository.find({
      where: { usuario_id: usuarioId },
      order: { creado_en: "DESC" }
    });
  }

  async findByCitaId(citaId: string): Promise<Pago | null> {
    await this.initialize();
    return await this.repository.findOne({
      where: { cita_id: citaId }
    });
  }

  async findAll(): Promise<Pago[]> {
    await this.initialize();
    return await this.repository.find({
      order: { creado_en: "DESC" }
    });
  }

  async update(id: string, updateData: Partial<Pago>): Promise<void> {
    await this.initialize();
    await this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    await this.initialize();
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}