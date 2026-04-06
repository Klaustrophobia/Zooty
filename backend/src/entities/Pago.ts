import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("pagos")
export class Pago {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "cita_id", type: "uuid" })
  cita_id!: string;

  @Column({ name: "usuario_id", type: "uuid" })
  usuario_id!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  monto!: number;

  @Column({ name: "monto_comision", type: "decimal", precision: 10, scale: 2 })
  monto_comision!: number;

  @Column({ name: "metodo_pago", type: "varchar", length: 50 })
  metodo_pago!: string;

  @Column({ name: "id_transaccion", type: "varchar", length: 255, nullable: true })
  id_transaccion!: string | null;

  @Column({ type: "varchar", length: 50, default: "pendiente" })
  estado!: string;

  @Column({ name: "fecha_pago", type: "timestamp", nullable: true })
  fecha_pago!: Date | null;

  @CreateDateColumn({ name: "creado_en", type: "timestamp" })
  creado_en!: Date;

  @UpdateDateColumn({ name: "actualizado_en", type: "timestamp" })
  actualizado_en!: Date;
}