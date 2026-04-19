import { NextRequest, NextResponse } from "next/server";
import { PagoController } from "@/controllers/pago.controller";

const pagoController = new PagoController();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await pagoController.getPagoById(request, id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await pagoController.updatePago(request, id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await pagoController.deletePago(request, id);
}