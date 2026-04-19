import { VeterinarioRepository } from "@/repositories/veterinario.repository";
import { Veterinario } from "@/entities/Veterinario";
import { VeterinarioDTO } from "@/dtos/veterinario.dto";

export class VeterinarioService {
  private formatVeterinario(
    v: Veterinario,
    userLat?: number,
    userLng?: number,
  ) {
    const lat = v.latitud != null ? Number(v.latitud) : null;
    const lng = v.longitud != null ? Number(v.longitud) : null;

    const distance =
      userLat != null && userLng != null && lat != null && lng != null
        ? this.calcularDistanciaKm(userLat, userLng, lat, lng)
        : null;

    const precios = v.servicios?.map((s) => Number(s.precio)) ?? [];

    return {
      id: v.id,
      nombre_negocio: v.nombre_negocio,
      promedio_calificacion: Number(v.promedio_calificacion), // 🔥 también esto
      specialty: v.especialidades?.map((e) => e.nombre).join(", ") || "",
      latitud: lat,
      longitud: lng,
      distance: distance ? `${distance.toFixed(1)} km` : null,
      precio: precios;
    };
  }

  private calcularDistanciaKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // radio de la tierra en km

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private veterinarioRepository: VeterinarioRepository;

  constructor() {
    this.veterinarioRepository = new VeterinarioRepository();
  }

  async createVeterinario(veterinarioData: {
    nombre_negocio: string;
    correo: string;
    telefono: string;
    direccion: string;
    latitud?: number;
    longitud?: number;
    descripcion?: string;
    url_logo?: string;
    url_banner?: string;
    atiende_24h?: boolean;
  }): Promise<Veterinario> {
    return await this.veterinarioRepository.create({
      ...veterinarioData,
      activo: true,
      promedio_calificacion: 0,
      total_calificaciones: 0,
    });
  }

  async getAllVeterinarios(userLat?: number, userLng?: number) {
    const DEFAULT_LAT = 14.0723;
    const DEFAULT_LNG = -87.1921;

    const lat = userLat ?? DEFAULT_LAT;
    const lng = userLng ?? DEFAULT_LNG;

    const vets = await this.veterinarioRepository.findAll();

    return vets.map((v) => this.formatVeterinario(v, lat, lng));
  }

  async getVeterinarioById(id: string): Promise<VeterinarioDTO | null> {
    const vet = await this.veterinarioRepository.findById(id);
    if (!vet) return null;

    return {
      id: vet.id,
      nombre_negocio: vet.nombre_negocio,
      promedio_calificacion: vet.promedio_calificacion,
      specialty: vet.especialidades?.map((e) => e.nombre).join(", ") || "",
      latitud: vet.latitud,
      longitud: vet.longitud,
    };
  }

  async getVeterinariosCercanos(lat: number, lng: number, radioKm = 10) {
    const vets = await this.veterinarioRepository.findCercanos(
      lat,
      lng,
      radioKm,
    );
    return vets.map((v) => this.formatVeterinario(v, lat, lng));
  }

  async updateVeterinario(
    id: string,
    updateData: Partial<Veterinario>,
  ): Promise<Veterinario | null> {
    await this.veterinarioRepository.update(id, updateData);
    return await this.veterinarioRepository.findById(id);
  }

  async deleteVeterinario(id: string): Promise<boolean> {
    return await this.veterinarioRepository.delete(id);
  }
}
