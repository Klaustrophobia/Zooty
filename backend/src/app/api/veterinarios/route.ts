import { NextRequest, NextResponse } from "next/server";
import { VeterinarioController } from "@/controllers/veterinario.controller";

const veterinarioController = new VeterinarioController();

export async function GET(request: NextRequest) {
  return await veterinarioController.getAllVeterinarios(request);
}

export async function POST(request: NextRequest) {
  return await veterinarioController.createVeterinario(request);
}