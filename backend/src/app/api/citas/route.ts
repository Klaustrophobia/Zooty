import { NextRequest, NextResponse } from "next/server";
import { CitaController } from "@/controllers/cita.controller";

const citaController = new CitaController();

export async function GET(request: NextRequest) {
  return await citaController.getAllCitas(request);
}

export async function POST(request: NextRequest) {
  return await citaController.createCita(request);
}