import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'supports', name: 'support' })
export class SupportEntity {
  @PrimaryGeneratedColumn({ name: 'id_support' })
  id: number;

  @Column({ name: 'id_client' })
  clientId: number;
 

  @Column({ name: 'vtitle', length: 250 })
  title: string;

  @Column({ name: 'tdescription', type: 'text' })
  description: string;

  @Column({ name: 'id_state', default: 1 })
  stateId: number;

  @Column({ name: 'id_user', nullable: true })
  userId: number;

  @Column({ name: 'id_prioridad', nullable: true })
  priorityId: number;
}
