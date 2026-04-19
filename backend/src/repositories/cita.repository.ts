import { AppDataSource, initializeDatabase } from "@/lib/db";
import { Cita } from "@/entities/Cita";
import { Repository, Between, MoreThanOrEqual } from "typeorm";

export class CitaRepository {
  private repository: Repository<Cita>;

  constructor() {
    this.repository = AppDataSource.getRepository(Cita);
  }

  private async initialize() {
    await initializeDatabase();
  }

  async create(citaData: Partial<Cita>): Promise<Cita> {
    await this.initialize();
    const cita = this.repository.create(citaData);
    return await this.repository.save(cita);
  }

  async findAll(): Promise<Cita[]> {
    return await this.repository.find({
      relations: ["usuario", "mascota", "servicio", "veterinario"],
      order: { fecha_cita: "DESC" },
    });
  }

  async findById(id: string): Promise<Cita | null> {
    await this.initialize();
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findByUsuarioId(usuarioId: string): Promise<Cita[]> {
    await this.initialize();
    return await this.repository.find({
      where: { usuario_id: usuarioId },
      order: { fecha_cita: "DESC" },
    });
  }

  async findByVeterinarioId(veterinarioId: string): Promise<Cita[]> {
    await this.initialize();
    return await this.repository.find({
      where: { veterinario_id: veterinarioId },
      order: { fecha_cita: "DESC" },
    });
  }

  async findByMascotaId(mascotaId: string): Promise<Cita[]> {
    await this.initialize();
    return await this.repository.find({
      where: { mascota_id: mascotaId },
      order: { fecha_cita: "DESC" },
    });
  }

  async findByFechaRange(inicio: Date, fin: Date): Promise<Cita[]> {
    await this.initialize();
    return await this.repository.find({
      where: {
        fecha_cita: Between(inicio, fin),
      },
      order: { fecha_cita: "ASC" },
    });
  }

  async findProximas(fecha: Date): Promise<Cita[]> {
    await this.initialize();
    return await this.repository.find({
      where: {
        fecha_cita: MoreThanOrEqual(fecha),
        estado: "pendiente",
      },
      order: { fecha_cita: "ASC" },
    });
  }

  async update(id: string, updateData: Partial<Cita>): Promise<void> {
    await this.initialize();
    await this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    await this.initialize();
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async verificarDisponibilidad(
    veterinarioId: string,
    fechaCita: Date,
  ): Promise<boolean> {
    await this.initialize();
    const inicio = new Date(fechaCita);
    inicio.setMinutes(inicio.getMinutes() - 30);
    const fin = new Date(fechaCita);
    fin.setMinutes(fin.getMinutes() + 30);

    const citaExistente = await this.repository.findOne({
      where: {
        veterinario_id: veterinarioId,
        fecha_cita: Between(inicio, fin),
        estado: "pendiente",
      },
    });

    return !citaExistente;
  }
}
