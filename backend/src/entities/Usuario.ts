import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  correo!: string;

  @Column({ type: "varchar", length: 255 })
  contrasena!: string;

  @Column({ name: "nombre_completo", type: "varchar", length: 255 })
  nombre_completo!: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  telefono!: string | null;

  @Column({ name: "url_avatar", type: "text", nullable: true })
  url_avatar!: string | null;

  @Column({ type: "boolean", default: true })
  activo!: boolean;

  @CreateDateColumn({ name: "creado_en", type: "timestamp" })
  creado_en!: Date;

  @UpdateDateColumn({ name: "actualizado_en", type: "timestamp" })
  actualizado_en!: Date;
}