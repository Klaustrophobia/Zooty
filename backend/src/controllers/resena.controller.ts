import { NextRequest, NextResponse } from "next/server";
import { ResenaService } from "@/services/resena.service";

export class ResenaController {
  private resenaService: ResenaService;

  constructor() {
    this.resenaService = new ResenaService();
  }

  async getAllResenas(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const veterinarioId = searchParams.get("veterinarioId");
      const usuarioId = searchParams.get("usuarioId");

      let resenas;
      if (veterinarioId) {
        resenas = await this.resenaService.getResenasByVeterinarioId(veterinarioId);
      } else if (usuarioId) {
        resenas = await this.resenaService.getResenasByUsuarioId(usuarioId);
      } else {
        resenas = await this.resenaService.getAllResenas();
      }

      return NextResponse.json(resenas);
    } catch (error) {
      console.error("Error en ResenaController.getAllResenas:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async createResena(request: NextRequest) {
    try {
      const body = await request.json();
      const { cita_id, usuario_id, veterinario_id, calificacion, comentario } = body;

      if (!cita_id || !usuario_id || !veterinario_id || calificacion === undefined) {
        return NextResponse.json(
          { error: "cita_id, usuario_id, veterinario_id y calificacion son requeridos" },
          { status: 400 }
        );
      }

      if (calificacion < 1 || calificacion > 5) {
        return NextResponse.json(
          { error: "La calificación debe estar entre 1 y 5" },
          { status: 400 }
        );
      }

      const resena = await this.resenaService.createResena({
        cita_id,
        usuario_id,
        veterinario_id,
        calificacion,
        comentario
      });

      return NextResponse.json(resena, { status: 201 });
    } catch (error) {
      console.error("Error en ResenaController.createResena:", error);
      const message = error instanceof Error ? error.message : "Error interno del servidor";
      const status = message === "Ya existe una reseña para esta cita" ? 409 : 400;
      return NextResponse.json({ error: message }, { status });
    }
  }

  async getResenaById(request: NextRequest, id: string) {
    try {
      const resena = await this.resenaService.getResenaById(id);

      if (!resena) {
        return NextResponse.json(
          { error: "Reseña no encontrada" },
          { status: 404 }
        );
      }

      return NextResponse.json(resena);
    } catch (error) {
      console.error("Error en ResenaController.getResenaById:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async updateResena(request: NextRequest, id: string) {
    try {
      const body = await request.json();
      const { calificacion, comentario, es_verificada } = body;

      const resenaExistente = await this.resenaService.getResenaById(id);
      if (!resenaExistente) {
        return NextResponse.json(
          { error: "Reseña no encontrada" },
          { status: 404 }
        );
      }

      if (calificacion !== undefined && (calificacion < 1 || calificacion > 5)) {
        return NextResponse.json(
          { error: "La calificación debe estar entre 1 y 5" },
          { status: 400 }
        );
      }

      const resenaActualizada = await this.resenaService.updateResena(id, {
        calificacion,
        comentario,
        es_verificada
      });

      return NextResponse.json(resenaActualizada);
    } catch (error) {
      console.error("Error en ResenaController.updateResena:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async deleteResena(request: NextRequest, id: string) {
    try {
      const resenaExistente = await this.resenaService.getResenaById(id);
      if (!resenaExistente) {
        return NextResponse.json(
          { error: "Reseña no encontrada" },
          { status: 404 }
        );
      }

      const deleted = await this.resenaService.deleteResena(id);
      return NextResponse.json({
        success: deleted,
        message: "Reseña eliminada correctamente"
      });
    } catch (error) {
      console.error("Error en ResenaController.deleteResena:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }
}