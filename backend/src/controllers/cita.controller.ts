import { NextRequest, NextResponse } from "next/server";
import { CitaService } from "@/services/cita.service";

export class CitaController {
  private citaService: CitaService;

  constructor() {
    this.citaService = new CitaService();
  }

  async getAllCitas(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const usuarioId = searchParams.get("usuarioId");
      const veterinarioId = searchParams.get("veterinarioId");
      const mascotaId = searchParams.get("mascotaId");
      const proximas = searchParams.get("proximas");

      let citas;
      if (usuarioId) {
        citas = await this.citaService.getCitasByUsuario(usuarioId);
      } else if (veterinarioId) {
        citas = await this.citaService.getCitasByVeterinario(veterinarioId);
      } else if (mascotaId) {
        citas = await this.citaService.getCitasByMascota(mascotaId);
      } else if (proximas === "true") {
        citas = await this.citaService.getCitasProximas(new Date());
      } else {
        citas = await this.citaService.getAllCitas();
      }

      return NextResponse.json(citas);
    } catch (error) {
      console.error("Error en CitaController.getAllCitas:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async createCita(request: NextRequest) {
    try {
      const body = await request.json();
      const { usuario_id, mascota_id, servicio_id, veterinario_id, fecha_cita, notas } = body;

      if (!usuario_id || !mascota_id || !servicio_id || !veterinario_id || !fecha_cita) {
        return NextResponse.json(
          { error: "usuario_id, mascota_id, servicio_id, veterinario_id y fecha_cita son requeridos" },
          { status: 400 }
        );
      }

      const cita = await this.citaService.createCita({
        usuario_id,
        mascota_id,
        servicio_id,
        veterinario_id,
        fecha_cita: new Date(fecha_cita),
        notas
      });

      return NextResponse.json(cita, { status: 201 });
    } catch (error) {
      console.error("Error en CitaController.createCita:", error);
      const message = error instanceof Error ? error.message : "Error interno del servidor";
      const status = message === "La fecha no está disponible" ? 409 : 500;
      return NextResponse.json({ error: message }, { status });
    }
  }

  async getCitaById(request: NextRequest, id: string) {
    try {
      const cita = await this.citaService.getCitaById(id);

      if (!cita) {
        return NextResponse.json(
          { error: "Cita no encontrada" },
          { status: 404 }
        );
      }

      return NextResponse.json(cita);
    } catch (error) {
      console.error("Error en CitaController.getCitaById:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async updateCita(request: NextRequest, id: string) {
    try {
      const body = await request.json();
      const { fecha_cita, estado, notas, estado_pago } = body;

      const citaExistente = await this.citaService.getCitaById(id);
      if (!citaExistente) {
        return NextResponse.json(
          { error: "Cita no encontrada" },
          { status: 404 }
        );
      }

      const citaActualizada = await this.citaService.updateCita(id, {
        fecha_cita: fecha_cita ? new Date(fecha_cita) : undefined,
        estado,
        notas,
        estado_pago
      });

      return NextResponse.json(citaActualizada);
    } catch (error) {
      console.error("Error en CitaController.updateCita:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async deleteCita(request: NextRequest, id: string) {
    try {
      const citaExistente = await this.citaService.getCitaById(id);
      if (!citaExistente) {
        return NextResponse.json(
          { error: "Cita no encontrada" },
          { status: 404 }
        );
      }

      const deleted = await this.citaService.deleteCita(id);
      return NextResponse.json({
        success: deleted,
        message: "Cita eliminada correctamente"
      });
    } catch (error) {
      console.error("Error en CitaController.deleteCita:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async procesarPago(request: NextRequest, id: string) {
    try {
      const body = await request.json();
      const { metodo_pago, id_transaccion } = body;

      if (!metodo_pago) {
        return NextResponse.json(
          { error: "metodo_pago es requerido" },
          { status: 400 }
        );
      }

      const pago = await this.citaService.procesarPago(id, metodo_pago, id_transaccion);
      return NextResponse.json(pago);
    } catch (error) {
      console.error("Error en CitaController.procesarPago:", error);
      const message = error instanceof Error ? error.message : "Error interno del servidor";
      const status = message === "Cita no encontrada" ? 404 : message === "La cita ya fue pagada" ? 409 : 500;
      return NextResponse.json({ error: message }, { status });
    }
  }

  async cancelarCita(request: NextRequest, id: string) {
    try {
      const cita = await this.citaService.cancelarCita(id);
      return NextResponse.json(cita);
    } catch (error) {
      console.error("Error en CitaController.cancelarCita:", error);
      const message = error instanceof Error ? error.message : "Error interno del servidor";
      const status = message === "Cita no encontrada" ? 404 : message === "No se puede cancelar una cita completada" ? 409 : 500;
      return NextResponse.json({ error: message }, { status });
    }
  }
}