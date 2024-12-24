import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'clients', name: 'client_platform' })
export class ClientPlatformEntity {
  @PrimaryGeneratedColumn({ name: 'id_clientplatform' })
  id: number;

  @Column({ name: 'id_client' })
  clientId: number;

  @Column({ name: 'id_platform' })
  platformId: number;
}
