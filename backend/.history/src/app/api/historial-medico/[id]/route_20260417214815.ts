import { NextRequest, NextResponse } from "next/server";
import { HistorialMedicoController } from "@/controllers/historialMedico.controller";

const historialController = new HistorialMedicoController();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await historialController.getRegistroById(request, id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await historialController.updateRegistro(request, id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await historialController.deleteRegistro(request, id);
}