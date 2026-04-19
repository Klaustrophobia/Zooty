import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Ma
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("servicios")
export class Servicio {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "nombre", type: "varchar", length: 255 })
  nombre!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  precio!: number;

  @Column({ type: "varchar", length: 50 })
  categoria!: string;

  @Column({ type: "text", nullable: true })
  descripcion!: string | null;

  @Column({ type: "int", default: 30 })
  duracion_minutos!: number;

  @Column({ type: "boolean", default: true })
  activo!: boolean;

  @CreateDateColumn()
  creado_en!: Date;

  @UpdateDateColumn()
  actualizado_en!: Date;

  @ManyToOne(() => Veterinario, (v) => v.servicios, { onDelete: "CASCADE" })
  @JoinColumn({ name: "veterinario_id" })
  veterinario!: Veterinario;
}
