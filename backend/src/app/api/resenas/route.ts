import { NextRequest, NextResponse } from "next/server";
import { ResenaController } from "@/controllers/resena.controller";

const resenaController = new ResenaController();

export async function GET(request: NextRequest) {
  return await resenaController.getAllResenas(request);
}

export async function POST(request: NextRequest) {
  return await resenaController.createResena(request);
}