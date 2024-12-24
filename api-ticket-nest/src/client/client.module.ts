import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { ClientEntity } from './entity/client.entity';
import { ClientPlatformEntity } from './entity/client-platform.entity';
import { ViewClientEntity } from './entity/view-client.entity';
import { ClientService } from './client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientEntity,
      ClientPlatformEntity,
      ViewClientEntity,
    ]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
