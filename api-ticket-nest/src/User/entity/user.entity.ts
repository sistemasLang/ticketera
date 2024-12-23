import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'users', name: 'user' }) 
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'id_user' })
  id: number;

  @Column({ name: 'vuser', length: 100 })
  username: string;

  @Column({ name: 'vpassword', length: 250 })
  password: string;

  @Column({ name: 'vname', length: 150 })
  firstName: string;

  @Column({ name: 'vlastname', length: 150 })
  lastName: string;

  @CreateDateColumn({ name: 'tscreated' })
  createdAt: Date;

  @Column({ name: 'benabled', default: true })
  isEnabled: boolean;

  @Column({ name: 'vemail', length: 150 })
  email: string;
}
