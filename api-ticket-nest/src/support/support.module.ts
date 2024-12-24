import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { ViewSupportEntity } from './entity/view-support.entity';
import { SupportEntity } from './entity/support.entity'; 
import { ClientModule } from '../client/client.module';

@Module({
  imports: [TypeOrmModule.forFeature([ViewSupportEntity, SupportEntity]),
  ClientModule], 
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
