import { NextRequest, NextResponse } from "next/server";
import { MascotaService } from "@/services/mascota.service";

export class MascotaController {
  private mascotaService: MascotaService;

  constructor() {
    this.mascotaService = new MascotaService();
  }

  async getAllMascotas(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const usuarioId = searchParams.get("usuarioId");

      let mascotas;
      if (usuarioId) {
        mascotas = await this.mascotaService.getMascotasByUsuarioId(usuarioId);
      } else {
        mascotas = await this.mascotaService.getAllMascotas();
      }

      return NextResponse.json(mascotas);
    } catch (error) {
      console.error("Error en MascotaController.getAllMascotas:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async createMascota(request: NextRequest) {
    try {
      const body = await request.json();
      const { usuario_id, nombre, especie, raza, fecha_nacimiento, peso, color, url_foto } = body;

      if (!usuario_id || !nombre || !especie) {
        return NextResponse.json(
          { error: "usuario_id, nombre y especie son requeridos" },
          { status: 400 }
        );
      }

      const mascota = await this.mascotaService.createMascota({
        usuario_id,
        nombre,
        especie,
        raza,
        fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : undefined,
        peso,
        color,
        url_foto
      });

      return NextResponse.json(mascota, { status: 201 });
    } catch (error) {
      console.error("Error en MascotaController.createMascota:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async getMascotaById(request: NextRequest, id: string) {
    try {
      const mascota = await this.mascotaService.getMascotaById(id);

      if (!mascota) {
        return NextResponse.json(
          { error: "Mascota no encontrada" },
          { status: 404 }
        );
      }

      return NextResponse.json(mascota);
    } catch (error) {
      console.error("Error en MascotaController.getMascotaById:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async updateMascota(request: NextRequest, id: string) {
    try {
      const body = await request.json();
      const { nombre, especie, raza, fecha_nacimiento, peso, color, url_foto, activo } = body;

      const mascotaExistente = await this.mascotaService.getMascotaById(id);
      if (!mascotaExistente) {
        return NextResponse.json(
          { error: "Mascota no encontrada" },
          { status: 404 }
        );
      }

      const mascotaActualizada = await this.mascotaService.updateMascota(id, {
        nombre,
        especie,
        raza,
        fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : undefined,
        peso,
        color,
        url_foto,
        activo
      });

      return NextResponse.json(mascotaActualizada);
    } catch (error) {
      console.error("Error en MascotaController.updateMascota:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async deleteMascota(request: NextRequest, id: string) {
    try {
      const mascotaExistente = await this.mascotaService.getMascotaById(id);
      if (!mascotaExistente) {
        return NextResponse.json(
          { error: "Mascota no encontrada" },
          { status: 404 }
        );
      }

      const deleted = await this.mascotaService.deleteMascota(id);
      return NextResponse.json({
        success: deleted,
        message: "Mascota eliminada correctamente"
      });
    } catch (error) {
      console.error("Error en MascotaController.deleteMascota:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }
}