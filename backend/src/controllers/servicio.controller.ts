import { NextRequest, NextResponse } from "next/server";
import { ServicioService } from "@/services/servicio.service";

export class ServicioController {
  private servicioService: ServicioService;

  constructor() {
    this.servicioService = new ServicioService();
  }

  async getAllServicios(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const veterinarioId = searchParams.get("veterinarioId");

      let servicios;
      if (veterinarioId) {
        servicios = await this.servicioService.getServiciosByVeterinarioId(veterinarioId);
      } else {
        servicios = await this.servicioService.getAllServicios();
      }

      return NextResponse.json(servicios);
    } catch (error) {
      console.error("Error en ServicioController.getAllServicios:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async createServicio(request: NextRequest) {
    try {
      const body = await request.json();
      const { veterinario_id, nombre, categoria, descripcion, duracion_minutos, precio } = body;

      if (!veterinario_id || !nombre || !categoria || precio === undefined) {
        return NextResponse.json(
          { error: "veterinario_id, nombre, categoria y precio son requeridos" },
          { status: 400 }
        );
      }

      const servicio = await this.servicioService.createServicio({
        veterinario_id,
        nombre,
        categoria,
        descripcion,
        duracion_minutos,
        precio
      });

      return NextResponse.json(servicio, { status: 201 });
    } catch (error) {
      console.error("Error en ServicioController.createServicio:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async getServicioById(request: NextRequest, id: string) {
    try {
      const servicio = await this.servicioService.getServicioById(id);

      if (!servicio) {
        return NextResponse.json(
          { error: "Servicio no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(servicio);
    } catch (error) {
      console.error("Error en ServicioController.getServicioById:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async updateServicio(request: NextRequest, id: string) {
    try {
      const body = await request.json();
      const { nombre, categoria, descripcion, duracion_minutos, precio, activo } = body;

      const servicioExistente = await this.servicioService.getServicioById(id);
      if (!servicioExistente) {
        return NextResponse.json(
          { error: "Servicio no encontrado" },
          { status: 404 }
        );
      }

      const servicioActualizado = await this.servicioService.updateServicio(id, {
        nombre,
        categoria,
        descripcion,
        duracion_minutos,
        precio,
        activo
      });

      return NextResponse.json(servicioActualizado);
    } catch (error) {
      console.error("Error en ServicioController.updateServicio:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async deleteServicio(request: NextRequest, id: string) {
    try {
      const servicioExistente = await this.servicioService.getServicioById(id);
      if (!servicioExistente) {
        return NextResponse.json(
          { error: "Servicio no encontrado" },
          { status: 404 }
        );
      }

      const deleted = await this.servicioService.deleteServicio(id);
      return NextResponse.json({
        success: deleted,
        message: "Servicio eliminado correctamente"
      });
    } catch (error) {
      console.error("Error en ServicioController.deleteServicio:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }
}