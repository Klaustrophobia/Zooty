import { NextRequest, NextResponse } from "next/server";
import { HistorialMedicoService } from "@/services/historialMedico.service";

export class HistorialMedicoController {
  private historialService: HistorialMedicoService;

  constructor() {
    this.historialService = new HistorialMedicoService();
  }

  async getRegistrosByMascotaId(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const mascotaId = searchParams.get("mascotaId");

      if (!mascotaId) {
        return NextResponse.json(
          { error: "mascotaId es requerido" },
          { status: 400 }
        );
      }

      const registros = await this.historialService.getRegistrosByMascotaId(mascotaId);
      return NextResponse.json(registros);
    } catch (error) {
      console.error("Error en HistorialMedicoController.getRegistrosByMascotaId:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async createRegistro(request: NextRequest) {
    try {
      const body = await request.json();
      const { mascota_id, tipo_registro, titulo, descripcion, fecha, fecha_proximo_vencimiento, nombre_veterinario, urls_documentos } = body;

      if (!mascota_id || !tipo_registro || !titulo || !fecha) {
        return NextResponse.json(
          { error: "mascota_id, tipo_registro, titulo y fecha son requeridos" },
          { status: 400 }
        );
      }

      const registro = await this.historialService.createRegistro({
        mascota_id,
        tipo_registro,
        titulo,
        descripcion,
        fecha: new Date(fecha),
        fecha_proximo_vencimiento: fecha_proximo_vencimiento ? new Date(fecha_proximo_vencimiento) : undefined,
        nombre_veterinario,
        urls_documentos
      });

      return NextResponse.json(registro, { status: 201 });
    } catch (error) {
      console.error("Error en HistorialMedicoController.createRegistro:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async getRegistroById(request: NextRequest, id: string) {
    try {
      const registro = await this.historialService.getRegistroById(id);

      if (!registro) {
        return NextResponse.json(
          { error: "Registro no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(registro);
    } catch (error) {
      console.error("Error en HistorialMedicoController.getRegistroById:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async updateRegistro(request: NextRequest, id: string) {
    try {
      const body = await request.json();
      const { tipo_registro, titulo, descripcion, fecha, fecha_proximo_vencimiento, nombre_veterinario, urls_documentos } = body;

      const registroExistente = await this.historialService.getRegistroById(id);
      if (!registroExistente) {
        return NextResponse.json(
          { error: "Registro no encontrado" },
          { status: 404 }
        );
      }

      const registroActualizado = await this.historialService.updateRegistro(id, {
        tipo_registro,
        titulo,
        descripcion,
        fecha: fecha ? new Date(fecha) : undefined,
        fecha_proximo_vencimiento: fecha_proximo_vencimiento ? new Date(fecha_proximo_vencimiento) : undefined,
        nombre_veterinario,
        urls_documentos
      });

      return NextResponse.json(registroActualizado);
    } catch (error) {
      console.error("Error en HistorialMedicoController.updateRegistro:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async deleteRegistro(request: NextRequest, id: string) {
    try {
      const registroExistente = await this.historialService.getRegistroById(id);
      if (!registroExistente) {
        return NextResponse.json(
          { error: "Registro no encontrado" },
          { status: 404 }
        );
      }

      const deleted = await this.historialService.deleteRegistro(id);
      return NextResponse.json({
        success: deleted,
        message: "Registro eliminado correctamente"
      });
    } catch (error) {
      console.error("Error en HistorialMedicoController.deleteRegistro:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async getProximosVencimientos(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const fecha = searchParams.get("fecha");

      const fechaReferencia = fecha ? new Date(fecha) : new Date();
      const vencimientos = await this.historialService.getProximosVencimientos(fechaReferencia);
      return NextResponse.json(vencimientos);
    } catch (error) {
      console.error("Error en HistorialMedicoController.getProximosVencimientos:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }
}