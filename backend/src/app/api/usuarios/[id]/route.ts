import { NextRequest, NextResponse } from "next/server";
import { UsuarioController } from "@/controllers/usuario.controller";

const usuarioController = new UsuarioController();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await usuarioController.getUsuarioById(request, id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await usuarioController.updateUsuario(request, id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await usuarioController.deleteUsuario(request, id);
}