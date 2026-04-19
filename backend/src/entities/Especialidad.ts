import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Veterinario } from "./Veterinario";

@Entity("especialidades")
export class Especialidad {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  nombre!: string;

  @ManyToMany(() => Veterinario, (vet) => vet.especialidades)
  veterinarios!: Veterinario[];
}