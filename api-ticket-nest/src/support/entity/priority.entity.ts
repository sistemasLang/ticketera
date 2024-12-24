import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'supports', name: 'priority_support' })

export class PriorityEntity {
  @PrimaryGeneratedColumn({ name: 'id_prioritysupport' })
  id: number;

  @Column({ name: 'vpriority', length: 250})
  vpriority: string;
 


}
