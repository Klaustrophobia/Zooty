import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Especialidad } from "./Especialidad";
import { Servicio } from "./Servicio";

@Entity("veterinarios")
export class Veterinario {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "nombre_negocio", type: "varchar", length: 255 })
  nombre_negocio!: string;

  @Column({ type: "decimal", precision: 3, scale: 2, default: 0 })
  promedio_calificacion!: number;

  @Column({ name: "correo", type: "varchar", length: 255 })
  correo!: string;
  @Column({ name: "telefono", type: "varchar", length: 20 })
  telefono!: string;
  @Column({ name: "direccion", type: "varchar", length: 500 })
  direccion!: string;
  @Column({ name: "latitud", type: "decimal", precision: 10, scale: 7, nullable: true })
  latitud!: number | null;
  @Column({ name: "longitud", type: "decimal", precision: 10, scale: 7, nullable: true })
  longitud!: number | null;
  @Column({ name: "descripcion", type: "text", nullable: true })
  descripcion!: string | null;
  @Column({ name: "url_logo", type: "varchar", length: 500, nullable: true })
  url_logo!: string | null;
  @Column({ name: "url_banner", type: "varchar", length: 500, nullable: true })
  url_banner!: string | null;
  @Column({ name: "atiende_24h", type: "boolean", default: false })
  atiende_24h!: boolean;
  @Column({ name: "activo", type: "boolean", default: true })
  activo!: boolean;
  @Column({ name: "total_calificaciones", type: "int", default: 0 })
  total_calificaciones!: number;
  @Column({ name: "creado_en", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  creado_en!: Date;
  @Column({ name: "actualizado_en", type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  actualizado_en!: Date;

  @ManyToMany(() => Especialidad, (esp) => esp.veterinarios, { eager: true })
  @JoinTable({
    name: "veterinario_especialidades",
    joinColumn: { name: "veterinario_id" },
    inverseJoinColumn: { name: "especialidad_id" }
  })
  especialidades!: Especialidad[];

  @ManyToMany(() => Servicio, (serv) => serv.veterinarios)
  @JoinTable({
    name: "servicios",
    joinColumn: { name: "veterinario_id" },
    inverseJoinColumn: { name: "servicio_id" }
  })
  servicios!: Servicio[];
}