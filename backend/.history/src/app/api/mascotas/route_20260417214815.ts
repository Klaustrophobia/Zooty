import { NextRequest, NextResponse } from "next/server";
import { MascotaController } from "@/controllers/mascota.controller";

const mascotaController = new MascotaController();

export async function GET(request: NextRequest) {
  return await mascotaController.getAllMascotas(request);
}

export async function POST(request: NextRequest) {
  return await mascotaController.createMascota(request);
}