import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Airport } from '../airport/airport.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Airline {
  @ApiProperty({ description: 'The ID of the airline', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The name of the airline',
    example: 'American Airlines',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Description of the airline',
    example: 'American Airlines is a major US airline.',
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'Foundation date of the airline',
    example: '1934-04-15',
  })
  @Column({ type: 'date' })
  foundationDate: Date;

  @ApiProperty({
    description: 'Website URL of the airline',
    example: 'https://www.aa.com',
  })
  @Column()
  website: string;

  @ManyToMany(() => Airport, (airport) => airport.airlines)
  @JoinTable()
  airports: Airport[];
}
