import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, IsUrl, MinDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAirlineDto {
  @ApiProperty({
    description: 'The name of the airline',
    example: 'American Airlines',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Description of the airline',
    example: 'American Airlines is a major US airline.',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'Foundation date of the airline',
    example: '1934-04-15',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  readonly foundationDate: Date;

  @ApiProperty({
    description: 'Website URL of the airline',
    example: 'https://www.aa.com',
  })
  @IsNotEmpty()
  @IsUrl()
  readonly website: string;
}
