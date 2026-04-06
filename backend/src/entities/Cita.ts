import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("citas")
export class Cita {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "usuario_id", type: "uuid" })
  usuario_id!: string;

  @Column({ name: "mascota_id", type: "uuid" })
  mascota_id!: string;

  @Column({ name: "servicio_id", type: "uuid" })
  servicio_id!: string;

  @Column({ name: "veterinario_id", type: "uuid" })
  veterinario_id!: string;

  @Column({ name: "fecha_cita", type: "timestamp" })
  fecha_cita!: Date;

  @Column({ type: "varchar", length: 50, default: "pendiente" })
  estado!: string;

  @Column({ type: "text", nullable: true })
  notas!: string | null;

  @Column({ name: "monto_total", type: "decimal", precision: 10, scale: 2 })
  monto_total!: number;

  @Column({ name: "estado_pago", type: "varchar", length: 50, default: "pendiente" })
  estado_pago!: string;

  @CreateDateColumn({ name: "creado_en", type: "timestamp" })
  creado_en!: Date;

  @UpdateDateColumn({ name: "actualizado_en", type: "timestamp" })
  actualizado_en!: Date;
}