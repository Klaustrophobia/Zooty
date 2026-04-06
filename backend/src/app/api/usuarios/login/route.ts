import { NextRequest, NextResponse } from "next/server";
import { UsuarioController } from "@/controllers/usuario.controller";

const usuarioController = new UsuarioController();

export async function POST(request: NextRequest) {
  return await usuarioController.login(request);
}