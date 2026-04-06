import { NextRequest, NextResponse } from "next/server";
import { VeterinarioService } from "@/services/veterinario.service";

export class VeterinarioController {
  private veterinarioService: VeterinarioService;

  constructor() {
    this.veterinarioService = new VeterinarioService();
  }

  async getAllVeterinarios(request: NextRequest) {
    try {
      const veterinarios = await this.veterinarioService.getAllVeterinarios();
      return NextResponse.json(veterinarios);
    } catch (error) {
      console.error("Error en VeterinarioController.getAllVeterinarios:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async createVeterinario(request: NextRequest) {
    try {
      const body = await request.json();
      const { nombre_negocio, correo, telefono, direccion, latitud, longitud, descripcion, url_logo, url_banner, atiende_24h } = body;

      if (!nombre_negocio || !correo || !telefono || !direccion) {
        return NextResponse.json(
          { error: "nombre_negocio, correo, telefono y direccion son requeridos" },
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

      const veterinario = await this.veterinarioService.createVeterinario({
        nombre_negocio,
        correo,
        telefono,
        direccion,
        latitud,
        longitud,
        descripcion,
        url_logo,
        url_banner,
        atiende_24h
      });

      return NextResponse.json(veterinario, { status: 201 });
    } catch (error) {
      console.error("Error en VeterinarioController.createVeterinario:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async getVeterinarioById(request: NextRequest, id: string) {
    try {
      const veterinario = await this.veterinarioService.getVeterinarioById(id);

      if (!veterinario) {
        return NextResponse.json(
          { error: "Veterinario no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(veterinario);
    } catch (error) {
      console.error("Error en VeterinarioController.getVeterinarioById:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async updateVeterinario(request: NextRequest, id: string) {
    try {
      const body = await request.json();
      const { nombre_negocio, correo, telefono, direccion, latitud, longitud, descripcion, url_logo, url_banner, atiende_24h, activo } = body;

      const veterinarioExistente = await this.veterinarioService.getVeterinarioById(id);
      if (!veterinarioExistente) {
        return NextResponse.json(
          { error: "Veterinario no encontrado" },
          { status: 404 }
        );
      }

      const veterinarioActualizado = await this.veterinarioService.updateVeterinario(id, {
        nombre_negocio,
        correo,
        telefono,
        direccion,
        latitud,
        longitud,
        descripcion,
        url_logo,
        url_banner,
        atiende_24h,
        activo
      });

      return NextResponse.json(veterinarioActualizado);
    } catch (error) {
      console.error("Error en VeterinarioController.updateVeterinario:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async deleteVeterinario(request: NextRequest, id: string) {
    try {
      const veterinarioExistente = await this.veterinarioService.getVeterinarioById(id);
      if (!veterinarioExistente) {
        return NextResponse.json(
          { error: "Veterinario no encontrado" },
          { status: 404 }
        );
      }

      const deleted = await this.veterinarioService.deleteVeterinario(id);
      return NextResponse.json({
        success: deleted,
        message: "Veterinario eliminado correctamente"
      });
    } catch (error) {
      console.error("Error en VeterinarioController.deleteVeterinario:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async getVeterinariosCercanos(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const latitud = parseFloat(searchParams.get("latitud") || "0");
      const longitud = parseFloat(searchParams.get("longitud") || "0");
      const radioKm = parseFloat(searchParams.get("radioKm") || "10");

      if (!latitud || !longitud) {
        return NextResponse.json(
          { error: "latitud y longitud son requeridos" },
          { status: 400 }
        );
      }

      const veterinarios = await this.veterinarioService.getVeterinariosCercanos(latitud, longitud, radioKm);
      return NextResponse.json(veterinarios);
    } catch (error) {
      console.error("Error en VeterinarioController.getVeterinariosCercanos:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }
}