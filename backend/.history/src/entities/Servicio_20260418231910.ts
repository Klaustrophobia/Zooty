import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Veterinario } from "./Veterinario";

@Entity("servicios")
export class Servicio {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "nombre", type: "varchar", length: 255 })
  nombre!: string;

  @Column({ type: "varchar", length: 50 })
  categoria!: string;

  @Column({ type: "text", nullable: true })
  descripcion!: string | null;

  @Column({ type: "int", default: 30 })
  duracion_minutos!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  precio!: number;

  @Column({ type: "boolean", default: true })
  activo!: boolean;

  @CreateDateColumn()
  creado_en!: Date;

  @UpdateDateColumn()
  actualizado_en!: Date;
}
