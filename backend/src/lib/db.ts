import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Usuario } from "@/entities/Usuario";
import { Mascota } from "@/entities/Mascota";
import { HistorialMedico } from "@/entities/HistorialMedico";
import { Veterinario } from "@/entities/Veterinario";
import { Servicio } from "@/entities/Servicio";
import { Cita } from "@/entities/Cita";
import { Pago } from "@/entities/Pago";
import { Resena } from "@/entities/Resena";
import { Especialidad } from '@/entities/Especialidad';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'soporte',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'zooty_db',
  synchronize: false,
  entities: [
    Usuario,
    Mascota,
    HistorialMedico,
    Veterinario,
    Servicio,
    Cita,
    Pago,
    Resena,
    Especialidad
  ],
  logging: ["error", "warn"],
  extra: {
    max: 20,
    connectionTimeoutMillis: 10000,
  }
});

export const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("✅ Base de datos Zooty conectada");
    } catch (error) {
      console.error("❌ Error conectando a la base de datos:", error);
      throw error;
    }
  }
  return AppDataSource;
};

export async function getDatabaseConnection() {
  return await initializeDatabase();
}