import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', 
      port: 5432,
      username: 'ticket',
      password: 'Ticket123',
      database: 'ticketdb',
      autoLoadEntities: true, 
      synchronize: false, 
    }),
  ],
})
export class DatabaseModule {}
