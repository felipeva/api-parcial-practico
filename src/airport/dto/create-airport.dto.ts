import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAirportDto {
  @ApiProperty({
    description: 'The name of the airport',
    example: 'John F. Kennedy International Airport',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'The three-letter code of the airport',
    example: 'JFK',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 3, { message: 'Airport code must be exactly 3 characters' })
  readonly code: string;

  @ApiProperty({
    description: 'The country where the airport is located',
    example: 'United States',
  })
  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @ApiProperty({
    description: 'The city where the airport is located',
    example: 'New York',
  })
  @IsNotEmpty()
  @IsString()
  readonly city: string;
}
