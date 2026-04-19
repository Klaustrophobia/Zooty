import { NextRequest } from "next/server";
import { VeterinarioController } from "@/controllers/veterinario.controller";

const veterinarioController = new VeterinarioController();

export async function GET(request: NextRequest) {
  return await veterinarioController.getVeterinariosCercanos(request);
}