import { NextRequest } from "next/server";
import { PagoController } from "@/controllers/pago.controller";

const pagoController = new PagoController();

export async function GET(request: NextRequest) {
  return await pagoController.getAllPagos(request);
}