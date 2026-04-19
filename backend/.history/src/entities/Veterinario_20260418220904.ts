import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  
} from "typeorm";
import { Especialidad } from "./Especialidad";
import { Servicio } from "./Servicio";

@Entity("veterinarios")
export class Veterinario {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "nombre_negocio", type: "varchar", length: 255 })
  nombre_negocio!: string;

  @Column({ type: "decimal", precision: 3, scale: 2, default: 0 })
  promedio_calificacion!: number;

  @Column({ name: "correo", type: "varchar", length: 255 })
  correo!: string;

  @Column({ name: "telefono", type: "varchar", length: 20 })
  telefono!: string;

  @Column({ name: "direccion", type: "varchar", length: 500 })
  direccion!: string;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  latitud!: number | null;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  longitud!: number | null;

  @Column({ type: "text", nullable: true })
  descripcion!: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  url_logo!: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  url_banner!: string | null;

  @Column({ type: "boolean", default: false })
  atiende_24h!: boolean;

  @Column({ type: "boolean", default: true })
  activo!: boolean;

  @Column({ type: "int", default: 0 })
  total_calificaciones!: number;

  @CreateDateColumn()
  creado_en!: Date;

  @UpdateDateColumn()
  actualizado_en!: Date;

  @OneToMany(() => Servicio, (s) => s.veterinario)
  servicios!: Servicio[];

  @ManyToMany(() => Especialidad, (esp) => esp.veterinarios, { eager: true })
  @JoinTable({
    name: "veterinario_especialidades",
    joinColumn: { name: "veterinario_id" },
    inverseJoinColumn: { name: "especialidad_id" },
  })
  especialidades!: Especialidad[];
}