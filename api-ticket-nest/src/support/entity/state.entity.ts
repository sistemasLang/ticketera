import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'supports', name: 'state' })

export class StateEntity {
  @PrimaryGeneratedColumn({ name: 'id_state' })
  id: number;

  @Column({ name: 'vstate', length: 250})
  vstate: string;
 


}
