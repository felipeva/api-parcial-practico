import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAirportsDto {
  @ApiProperty({
    description: 'Array of airport IDs to associate with the airline',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  readonly airportIds: number[];
}
