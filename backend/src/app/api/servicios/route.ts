import { NextRequest, NextResponse } from "next/server";
import { ServicioController } from "@/controllers/servicio.controller";

const servicioController = new ServicioController();

export async function GET(request: NextRequest) {
  return await servicioController.getAllServicios(request);
}

export async function POST(request: NextRequest) {
  return await servicioController.createServicio(request);
}