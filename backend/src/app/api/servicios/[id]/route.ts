import { NextRequest, NextResponse } from "next/server";
import { ServicioController } from "@/controllers/servicio.controller";

const servicioController = new ServicioController();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await servicioController.getServicioById(request, id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await servicioController.updateServicio(request, id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await servicioController.deleteServicio(request, id);
}