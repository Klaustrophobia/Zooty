import { NextRequest, NextResponse } from "next/server";
import { VeterinarioController } from "@/controllers/veterinario.controller";

const veterinarioController = new VeterinarioController();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await veterinarioController.getVeterinarioById(request, id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await veterinarioController.updateVeterinario(request, id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await veterinarioController.deleteVeterinario(request, id);
}