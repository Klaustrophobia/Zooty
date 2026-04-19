import { NextRequest, NextResponse } from "next/server";
import { HistorialMedicoController } from "@/controllers/historialMedico.controller";

const historialController = new HistorialMedicoController();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vencimientos = searchParams.get("vencimientos");
  
  if (vencimientos === "true") {
    return await historialController.getProximosVencimientos(request);
  }
  
  return await historialController.getRegistrosByMascotaId(request);
}

export async function POST(request: NextRequest) {
  return await historialController.createRegistro(request);
}