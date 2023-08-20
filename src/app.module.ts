import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FoodModule } from './modules/food/food.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      //We import the ConfigModule to use the ConfigService to access the environment variables
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        //*Database Settings
        type: 'mysql',
        //We get get the value of the environment variable DATABASE_HOST
        host: configService.get<string>('DATABASE_HOST'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User],
        synchronize: false,
        autoLoadEntities: true,
        options: { encrypt: false },
        //*Migrations Settings
        //Migrations Table Name
        migrationsTableName: 'migrations',
        //Migrations Folder
        migrations: ['../migrations/*{.ts,.js}'],
        //Automatically run migrations on app start if needed
        migrationsRun: true,
        port: 3306
      }),
      inject: [ConfigService]
    }),
    UserModule,
    AuthModule,
    FoodModule
  ]
})
export class AppModule {}
