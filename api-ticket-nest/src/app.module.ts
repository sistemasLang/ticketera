import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Importar ConfigModule
import { usersModule } from './User/users.module';
import { SupportModule } from './support/support.module';
import { ClientModule } from './client/client.module';
import { DatabaseModule } from './database/database.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    usersModule,
    SupportModule,
    ClientModule,
    DatabaseModule,
  ],
  controllers: [],
})
export class AppModule {}
