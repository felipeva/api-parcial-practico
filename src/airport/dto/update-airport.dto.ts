import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateAirportDto {
  @ApiProperty({
    description: 'The name of the airport',
    example: 'John F. Kennedy International Airport',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    description: 'The three-letter code of the airport',
    example: 'JFK',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 3, { message: 'Airport code must be exactly 3 characters' })
  readonly code?: string;

  @ApiProperty({
    description: 'The country where the airport is located',
    example: 'United States',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly country?: string;

  @ApiProperty({
    description: 'The city where the airport is located',
    example: 'New York',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly city?: string;
}
