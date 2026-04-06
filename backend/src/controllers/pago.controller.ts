import { NextRequest, NextResponse } from "next/server";
import { PagoService } from "@/services/pago.service";

export class PagoController {
  private pagoService: PagoService;

  constructor() {
    this.pagoService = new PagoService();
  }

  async getAllPagos(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const usuarioId = searchParams.get("usuarioId");
      const citaId = searchParams.get("citaId");

      let pagos;
      if (usuarioId) {
        pagos = await this.pagoService.getPagosByUsuarioId(usuarioId);
      } else if (citaId) {
        const pago = await this.pagoService.getPagoByCitaId(citaId);
        pagos = pago ? [pago] : [];
      } else {
        pagos = await this.pagoService.getAllPagos();
      }

      return NextResponse.json(pagos);
    } catch (error) {
      console.error("Error en PagoController.getAllPagos:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async getPagoById(request: NextRequest, id: string) {
    try {
      const pago = await this.pagoService.getPagoById(id);

      if (!pago) {
        return NextResponse.json(
          { error: "Pago no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(pago);
    } catch (error) {
      console.error("Error en PagoController.getPagoById:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async updatePago(request: NextRequest, id: string) {
    try {
      const body = await request.json();
      const { estado, id_transaccion } = body;

      const pagoExistente = await this.pagoService.getPagoById(id);
      if (!pagoExistente) {
        return NextResponse.json(
          { error: "Pago no encontrado" },
          { status: 404 }
        );
      }

      const pagoActualizado = await this.pagoService.updatePago(id, {
        estado,
        id_transaccion,
        fecha_pago: estado === "completado" ? new Date() : undefined
      });

      return NextResponse.json(pagoActualizado);
    } catch (error) {
      console.error("Error en PagoController.updatePago:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  async deletePago(request: NextRequest, id: string) {
    try {
      const pagoExistente = await this.pagoService.getPagoById(id);
      if (!pagoExistente) {
        return NextResponse.json(
          { error: "Pago no encontrado" },
          { status: 404 }
        );
      }

      const deleted = await this.pagoService.deletePago(id);
      return NextResponse.json({
        success: deleted,
        message: "Pago eliminado correctamente"
      });
    } catch (error) {
      console.error("Error en PagoController.deletePago:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }
}