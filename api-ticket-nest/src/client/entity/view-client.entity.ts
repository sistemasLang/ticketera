import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'clients', name: 'view_client' })
export class ViewClientEntity {
  @PrimaryGeneratedColumn({ name: 'id_client' })
  id: number;

  @Column({ name: 'vclient', length: 150 })
  clientName: string;

  @Column({ name: 'vweb', length: 150 })
  website: string;

  @Column({ name: 'benable' })
  isEnabled: boolean;

  @Column({ name: 'vhabilitado', length: 50 })
  enabledText: string; // Contiene "Sí" o "No" basado en la vista
}
