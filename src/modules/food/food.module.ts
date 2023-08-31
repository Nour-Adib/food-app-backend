import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [HttpModule, CacheModule.register(), UserModule],
  controllers: [FoodController],
  providers: [FoodService]
})
export class FoodModule {}
