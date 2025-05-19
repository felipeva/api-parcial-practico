import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Airline } from '../airline/airline.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Airport {
  @ApiProperty({ description: 'The ID of the airport', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The name of the airport',
    example: 'John F. Kennedy International Airport',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The three-letter code of the airport',
    example: 'JFK',
  })
  @Column({ length: 3 })
  code: string;

  @ApiProperty({
    description: 'The country where the airport is located',
    example: 'United States',
  })
  @Column()
  country: string;

  @ApiProperty({
    description: 'The city where the airport is located',
    example: 'New York',
  })
  @Column()
  city: string;

  @ManyToMany(() => Airline, (airline) => airline.airports)
  airlines: Airline[];
}
