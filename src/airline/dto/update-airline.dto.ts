import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, IsUrl, MinDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAirlineDto {
  @ApiProperty({
    description: 'The name of the airline',
    example: 'American Airlines',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    description: 'Description of the airline',
    example: 'American Airlines is a major US airline.',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    description: 'Foundation date of the airline',
    example: '1934-04-15',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly foundationDate?: Date;

  @ApiProperty({
    description: 'Website URL of the airline',
    example: 'https://www.aa.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  readonly website?: string;
}
