import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("historial_medico")
export class HistorialMedico {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "mascota_id", type: "uuid" })
  mascota_id!: string;

  @Column({ name: "tipo_registro", type: "varchar", length: 50 })
  tipo_registro!: string;

  @Column({ type: "varchar", length: 255 })
  titulo!: string;

  @Column({ type: "text", nullable: true })
  descripcion!: string | null;

  @Column({ type: "date" })
  fecha!: Date;

  @Column({ name: "fecha_proximo_vencimiento", type: "date", nullable: true })
  fecha_proximo_vencimiento!: Date | null;

  @Column({ name: "nombre_veterinario", type: "varchar", length: 255, nullable: true })
  nombre_veterinario!: string | null;

  @Column({ name: "urls_documentos", type: "text", array: true, nullable: true })
  urls_documentos!: string[] | null;

  @CreateDateColumn({ name: "creado_en", type: "timestamp" })
  creado_en!: Date;

  @UpdateDateColumn({ name: "actualizado_en", type: "timestamp" })
  actualizado_en!: Date;
}