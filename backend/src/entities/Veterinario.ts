import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("veterinarios")
export class Veterinario {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "nombre_negocio", type: "varchar", length: 255 })
  nombre_negocio!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  correo!: string;

  @Column({ type: "varchar", length: 50 })
  telefono!: string;

  @Column({ type: "text" })
  direccion!: string;

  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  latitud!: number | null;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  longitud!: number | null;

  @Column({ type: "text", nullable: true })
  descripcion!: string | null;

  @Column({ name: "url_logo", type: "text", nullable: true })
  url_logo!: string | null;

  @Column({ name: "url_banner", type: "text", nullable: true })
  url_banner!: string | null;

  @Column({ name: "atiende_24h", type: "boolean", default: false })
  atiende_24h!: boolean;

  @Column({ type: "boolean", default: true })
  activo!: boolean;

  @Column({ name: "promedio_calificacion", type: "decimal", precision: 3, scale: 2, default: 0 })
  promedio_calificacion!: number;

  @Column({ name: "total_calificaciones", type: "int", default: 0 })
  total_calificaciones!: number;

  @CreateDateColumn({ name: "creado_en", type: "timestamp" })
  creado_en!: Date;

  @UpdateDateColumn({ name: "actualizado_en", type: "timestamp" })
  actualizado_en!: Date;
}