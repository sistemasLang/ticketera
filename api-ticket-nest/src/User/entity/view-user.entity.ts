import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'users', name: 'view_user' }) 
export class ViewUserEntity {
  @PrimaryColumn({ name: 'id_user' })
  id: number;

  @Column({ name: 'vuser' })
  username: string;

  @Column({ name: 'vname' })
  firstName: string;

  @Column({ name: 'vlastname' })
  lastName: string;

  @Column({ name: 'vusuario' })
  vusuario: string;

  @Column({ name: 'dcreated' })
  dcreated: string;

  @Column({ name: 'benabled' })
  isEnabled: boolean;

  @Column({ name: 'vhabilitado' })
  vhabilitado: string;

  @Column({ name: 'vemail' })
  email: string;
}
