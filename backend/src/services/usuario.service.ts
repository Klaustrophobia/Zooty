import { UsuarioRepository } from "@/repositories/usuario.repository";
import { Usuario } from "@/entities/Usuario";
import * as bcrypt from "bcrypt";

export class UsuarioService {
  private usuarioRepository: UsuarioRepository;

  constructor() {
    this.usuarioRepository = new UsuarioRepository();
  }

  async createUsuario(usuarioData: {
    correo: string;
    contrasena: string;
    nombre_completo: string;
    telefono?: string;
    url_avatar?: string;
  }): Promise<Usuario> {
    const existe = await this.usuarioRepository.findByEmail(usuarioData.correo);
    if (existe) {
      throw new Error("El correo ya está registrado");
    }

    const saltRounds = 10;
    const contrasenaHasheada = await bcrypt.hash(usuarioData.contrasena, saltRounds);

    return await this.usuarioRepository.create({
      ...usuarioData,
      contrasena: contrasenaHasheada,
      activo: true
    });
  }

  async login(correo: string, contrasena: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findByEmail(correo);
    if (!usuario) {
      throw new Error("Credenciales inválidas");
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      throw new Error("Credenciales inválidas");
    }

    if (!usuario.activo) {
      throw new Error("Usuario inactivo");
    }

    return usuario;
  }

  async getAllUsuarios(): Promise<Usuario[]> {
    return await this.usuarioRepository.findAll();
  }

  async getUsuarioById(id: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findById(id);
  }

  async updateUsuario(id: string, updateData: Partial<Usuario>): Promise<Usuario | null> {
    if (updateData.contrasena) {
      const saltRounds = 10;
      updateData.contrasena = await bcrypt.hash(updateData.contrasena, saltRounds);
    }
    
    await this.usuarioRepository.update(id, updateData);
    return await this.usuarioRepository.findById(id);
  }

  async deleteUsuario(id: string): Promise<boolean> {
    return await this.usuarioRepository.delete(id);
  }

  async getUsuarioByEmail(correo: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findByEmail(correo);
  }

  async getUsuariosActivos(): Promise<Usuario[]> {
    return await this.usuarioRepository.findActiveUsers();
  }
}