import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'supports', name: 'view_support' })
export class ViewSupportEntity {
  @PrimaryGeneratedColumn({ name: 'id_support' })
  id: number;

  @Column({ name: 'id_client' })
  clientId: number;

  @Column({ name: 'vtitle', length: 255 })
  title: string;

  @Column({ name: 'tdescription', type: 'text' })
  description: string;

  @Column({ name: 'id_user', nullable: true })
  userId: number;

  @Column({ name: 'id_prioridad', nullable: true })
  priorityId: number;

  @Column({ name: 'id_state' })
  stateId: number;

  @Column({ name: 'vclient', length: 150 })
  clientName: string;

  @Column({ name: 'vweb', length: 150 })
  clientWebsite: string;

  @Column({ name: 'vusuario', length: 255, nullable: true })
  userName: string;

  @Column({ name: 'vpriority', length: 100, nullable: true })
  priority: string;

  @Column({ name: 'vstate', length: 100 })
  state: string;
}
