import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineService } from './airline.service';
import { AirlineController } from './airline.controller';
import { Airline } from './airline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Airline])],
  providers: [AirlineService],
  controllers: [AirlineController],
  exports: [AirlineService],
})
export class AirlineModule {}
