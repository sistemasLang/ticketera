import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'supports', name: 'comment' })
export class SupportEntity {
  @PrimaryGeneratedColumn({ name: 'id_comment' })
  id: number;

  @Column({ name: 'id_support' })
  idsupport: number;
 

  @Column({ name: 'vtitle', length: 250 })
  title: string;

  @Column({ name: 'tdescription', type: 'text' })
  description: string;

  @CreateDateColumn({ name: 'tscreated' })
  createdAt: Date;
  
  @Column({ name: 'id_state', default: 1 })
  stateId: number;

  @Column({ name: 'id_user', nullable: true })
  userId: number;

  @Column({ name: 'id_prioridad', nullable: true })
  priorityId: number;
}
