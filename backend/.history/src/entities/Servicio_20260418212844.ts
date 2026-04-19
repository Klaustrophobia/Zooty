import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("servicios")
export class Servicio {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "veterinario_id", type: "uuid" })
  veterinario_id!: string;

  @Column({ type: "varchar", length: 255 })
  nombre!: string;

  @Column({ type: "varchar", length: 50 })
  categoria!: string;

  @Column({ type: "text", nullable: true })
  descripcion!: string | null;

  @Column({ name: "duracion_minutos", type: "int", default: 30 })
  duracion_minutos!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  precio!: number;

  @Column({ type: "boolean", default: true })
  activo!: boolean;

  @CreateDateColumn({ name: "creado_en", type: "timestamp" })
  creado_en!: Date;

  @UpdateDateColumn({ name: "actualizado_en", type: "timestamp" })
  actualizado_en!: Date;

    @ManyToMany(() => Veterinario, (vet) => vet.especialidades)
    veterinarios!: Veterinario[];
}