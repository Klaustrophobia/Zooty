import { NextRequest, NextResponse } from "next/server";
import { UsuarioService } from "@/services/usuario.service";

export class UsuarioController {
  private usuarioService: UsuarioService;

  constructor() {
    this.usuarioService = new UsuarioService();
  }

  async getAllUsuarios(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const activo = searchParams.get("activo");

      let usuarios;
      if (activo === "true") {
        usuarios = await this.usuarioService.getUsuariosActivos();
      } else {
        usuarios = await this.usuarioService.getAllUsuarios();
      }

      const usuariosSinContrasena = usuarios.map(({ contrasena, ...rest }) => rest);
      return NextResponse.json(usuariosSinContrasena);
    } catch (error) {
      console.error("Error en UsuarioController.getAllUsuarios:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async createUsuario(request: NextRequest) {
    try {
      const body = await request.json();
      const { correo, contrasena, nombre_completo, telefono, url_avatar } = body;

      if (!correo || !contrasena || !nombre_completo) {
        return NextResponse.json(
          { error: "Correo, contraseña y nombre completo son requeridos" },
          { status: 400 }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        return NextResponse.json(
          { error: "El formato del correo electrónico no es válido" },
          { status: 400 }
        );
      }

      const usuario = await this.usuarioService.createUsuario({
        correo,
        contrasena,
        nombre_completo,
        telefono,
        url_avatar
      });

      const { contrasena: _, ...usuarioSinContrasena } = usuario;
      return NextResponse.json(usuarioSinContrasena, { status: 201 });
    } catch (error) {
      console.error("Error en UsuarioController.createUsuario:", error);
      const message = error instanceof Error ? error.message : "Error interno del servidor";
      const status = message === "El correo ya está registrado" ? 400 : 500;
      return NextResponse.json({ error: message }, { status });
    }
  }

  async getUsuarioById(request: NextRequest, id: string) {
    try {
      const usuario = await this.usuarioService.getUsuarioById(id);

      if (!usuario) {
        return NextResponse.json(
          { error: "Usuario no encontrado" },
          { status: 404 }
        );
      }

      const { contrasena, ...usuarioSinContrasena } = usuario;
      return NextResponse.json(usuarioSinContrasena);
    } catch (error) {
      console.error("Error en UsuarioController.getUsuarioById:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async updateUsuario(request: NextRequest, id: string) {
    try {
      const body = await request.json();
      const { correo, contrasena, nombre_completo, telefono, url_avatar, activo } = body;

      const usuarioExistente = await this.usuarioService.getUsuarioById(id);
      if (!usuarioExistente) {
        return NextResponse.json(
          { error: "Usuario no encontrado" },
          { status: 404 }
        );
      }

      const usuarioActualizado = await this.usuarioService.updateUsuario(id, {
        correo,
        contrasena,
        nombre_completo,
        telefono,
        url_avatar,
        activo
      });

      const { contrasena: _, ...usuarioSinContrasena } = usuarioActualizado!;
      return NextResponse.json(usuarioSinContrasena);
    } catch (error) {
      console.error("Error en UsuarioController.updateUsuario:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async deleteUsuario(request: NextRequest, id: string) {
    try {
      const usuarioExistente = await this.usuarioService.getUsuarioById(id);
      if (!usuarioExistente) {
        return NextResponse.json(
          { error: "Usuario no encontrado" },
          { status: 404 }
        );
      }

      const deleted = await this.usuarioService.deleteUsuario(id);
      return NextResponse.json({
        success: deleted,
        message: "Usuario eliminado correctamente"
      });
    } catch (error) {
      console.error("Error en UsuarioController.deleteUsuario:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async login(request: NextRequest) {
    try {
      const body = await request.json();
      const { correo, contrasena } = body;

      if (!correo || !contrasena) {
        return NextResponse.json(
          { error: "Correo y contraseña son requeridos" },
          { status: 400 }
        );
      }

      const usuario = await this.usuarioService.login(correo, contrasena);
      const { contrasena: _, ...usuarioSinContrasena } = usuario;
      return NextResponse.json(usuarioSinContrasena);
    } catch (error) {
      console.error("Error en UsuarioController.login:", error);
      const message = error instanceof Error ? error.message : "Error interno del servidor";
      const status = message === "Credenciales inválidas" || message === "Usuario inactivo" ? 401 : 500;
      return NextResponse.json({ error: message }, { status });
    }
  }
}