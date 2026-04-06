import { AppDataSource, initializeDatabase } from "@/lib/db";
import { Usuario } from "@/entities/Usuario";
import { Repository } from "typeorm";

export class UsuarioRepository {
  private repository: Repository<Usuario>;

  constructor() {
    this.repository = AppDataSource.getRepository(Usuario);
  }

  private async initialize() {
    await initializeDatabase();
  }

  async create(usuarioData: Partial<Usuario>): Promise<Usuario> {
    await this.initialize();
    const usuario = this.repository.create(usuarioData);
    return await this.repository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    await this.initialize();
    return await this.repository.find({
      order: { creado_en: "DESC" }
    });
  }

  async findById(id: string): Promise<Usuario | null> {
    await this.initialize();
    return await this.repository.findOne({
      where: { id }
    });
  }

  async update(id: string, updateData: Partial<Usuario>): Promise<void> {
    await this.initialize();
    await this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    await this.initialize();
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async findByEmail(correo: string): Promise<Usuario | null> {
    await this.initialize();
    return await this.repository.findOne({
      where: { correo }
    });
  }

  async findActiveUsers(): Promise<Usuario[]> {
    await this.initialize();
    return await this.repository.find({
      where: { activo: true },
      order: { creado_en: "DESC" }
    });
  }
}