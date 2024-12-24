import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'clients', name: 'client' })
export class ClientEntity {
  @PrimaryGeneratedColumn({ name: 'id_client' })
  id: number;

  @Column({ name: 'vauthclient', length: 250 })
  authClient: string;

  @Column({ name: 'vsecret', length: 250 })
  secret: string;

  @Column({ name: 'vclient', length: 150 })
  clientName: string;

  @Column({ name: 'vweb', length: 150 })
  website: string;

  @Column({ name: 'benable', default: true })
  isEnabled: boolean;
}
