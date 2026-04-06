import { NextRequest, NextResponse } from "next/server";
import { ResenaController } from "@/controllers/resena.controller";

const resenaController = new ResenaController();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await resenaController.getResenaById(request, id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await resenaController.updateResena(request, id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await resenaController.deleteResena(request, id);
}