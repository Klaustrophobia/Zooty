import { NextRequest } from "next/server";
import { CitaController } from "@/controllers/cita.controller";

const citaController = new CitaController();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await citaController.cancelarCita(request, id);
}