import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { ViewSupportEntity } from './entity/view-support.entity';
import { SupportEntity } from './entity/support.entity'; 
import { ClientModule } from '../client/client.module';
import { PriorityEntity } from './entity/priority.entity';
import { StateEntity } from './entity/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ViewSupportEntity, SupportEntity, PriorityEntity, StateEntity]),
  ClientModule], 
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
