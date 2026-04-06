import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("mascotas")
export class Mascota {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "usuario_id", type: "uuid" })
  usuario_id!: string;

  @Column({ type: "varchar", length: 100 })
  nombre!: string;

  @Column({ type: "varchar", length: 50 })
  especie!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  raza!: string | null;

  @Column({ name: "fecha_nacimiento", type: "date", nullable: true })
  fecha_nacimiento!: Date | null;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  peso!: number | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  color!: string | null;

  @Column({ name: "url_foto", type: "text", nullable: true })
  url_foto!: string | null;

  @Column({ type: "boolean", default: true })
  activo!: boolean;

  @CreateDateColumn({ name: "creado_en", type: "timestamp" })
  creado_en!: Date;

  @UpdateDateColumn({ name: "actualizado_en", type: "timestamp" })
  actualizado_en!: Date;
}