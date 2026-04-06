import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("resenas")
export class Resena {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "cita_id", type: "uuid" })
  cita_id!: string;

  @Column({ name: "usuario_id", type: "uuid" })
  usuario_id!: string;

  @Column({ name: "veterinario_id", type: "uuid" })
  veterinario_id!: string;

  @Column({ type: "int" })
  calificacion!: number;

  @Column({ type: "text", nullable: true })
  comentario!: string | null;

  @Column({ name: "es_verificada", type: "boolean", default: true })
  es_verificada!: boolean;

  @CreateDateColumn({ name: "creado_en", type: "timestamp" })
  creado_en!: Date;

  @UpdateDateColumn({ name: "actualizado_en", type: "timestamp" })
  actualizado_en!: Date;
}