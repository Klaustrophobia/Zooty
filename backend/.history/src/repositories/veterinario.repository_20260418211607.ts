import { AppDataSource, initializeDatabase } from "@/lib/db";
import { Veterinario } from "@/entities/Veterinario";
import { Repository } from "typeorm";

export class VeterinarioRepository {
  private repository: Repository<Veterinario>;

  constructor() {
    this.repository = AppDataSource.getRepository(Veterinario);
  }

  private async initialize() {
    await initializeDatabase();
  }

  async create(veterinarioData: Partial<Veterinario>): Promise<Veterinario> {
    await this.initialize();
    const veterinario = this.repository.create(veterinarioData);
    return await this.repository.save(veterinario);
  }

  async findAll(): Promise<Veterinario[]> {
    await this.initialize();

    return await this.repository.find({
      where: { activo: true },
      relations: ["especialidades"], // OK
      select: {
        id: true,
        nombre_negocio: true,
        promedio_calificacion: true,
        latitud: true,
        longitud: true,
        especialidades: true,
      }, // 🔥 fuerza limpieza
      order: { creado_en: "DESC" },
    });
  }

  async findById(id: string): Promise<Veterinario | null> {
    await this.initialize();
    return await this.repository.findOne({
      where: { id },
      relations: ["especialidades"],
    });
  }

  async findCercanos(
    latitud: number,
    longitud: number,
    radioKm: number = 10,
  ): Promise<Veterinario[]> {
    await this.initialize();
    const gradoLatitud = radioKm / 111;
    const gradoLongitud = radioKm / (111 * Math.cos((latitud * Math.PI) / 180));

    return await this.repository
      .createQueryBuilder("veterinario")
      .leftJoinAndSelect("veterinario.especialidades", "especialidades")
      .where("veterinario.latitud BETWEEN :minLat AND :maxLat", {
        minLat: latitud - gradoLatitud,
        maxLat: latitud + gradoLatitud,
      })
      .andWhere("veterinario.longitud BETWEEN :minLng AND :maxLng", {
        minLng: longitud - gradoLongitud,
        maxLng: longitud + gradoLongitud,
      })
      .andWhere("veterinario.activo = true")
      .orderBy("veterinario.promedio_calificacion", "DESC")
      .getMany();
  }

  async update(id: string, updateData: Partial<Veterinario>): Promise<void> {
    await this.initialize();
    await this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    await this.initialize();
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async updatePromedio(
    id: string,
    promedio: number,
    total: number,
  ): Promise<void> {
    await this.initialize();
    await this.repository.update(id, {
      promedio_calificacion: promedio,
      total_calificaciones: total,
    });
  }
}
