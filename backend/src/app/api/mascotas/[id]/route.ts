import { NextRequest, NextResponse } from "next/server";
import { MascotaController } from "@/controllers/mascota.controller";

const mascotaController = new MascotaController();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await mascotaController.getMascotaById(request, id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await mascotaController.updateMascota(request, id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await mascotaController.deleteMascota(request, id);
}