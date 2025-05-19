import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AirlineService } from './airline.service';
import { Airline } from './airline.entity';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';

@ApiTags('airlines')
@Controller('airlines')
@UseInterceptors(ClassSerializerInterceptor)
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  @Get()
  @ApiOperation({ summary: 'Get all airlines' })
  @ApiResponse({
    status: 200,
    description: 'Return all airlines',
    type: [Airline],
  })
  async findAll(): Promise<Airline[]> {
    return this.airlineService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific airline by ID' })
  @ApiParam({ name: 'id', description: 'Airline ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the airline',
    type: Airline,
  })
  @ApiResponse({ status: 404, description: 'Airline not found' })
  async findOne(@Param('id') id: number): Promise<Airline> {
    return this.airlineService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new airline' })
  @ApiResponse({
    status: 201,
    description: 'The airline has been created',
    type: Airline,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(@Body() createAirlineDto: CreateAirlineDto): Promise<Airline> {
    return this.airlineService.create(createAirlineDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an airline' })
  @ApiParam({ name: 'id', description: 'Airline ID' })
  @ApiResponse({
    status: 200,
    description: 'The airline has been updated',
    type: Airline,
  })
  @ApiResponse({ status: 404, description: 'Airline not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async update(
    @Param('id') id: number,
    @Body() updateAirlineDto: UpdateAirlineDto,
  ): Promise<Airline> {
    return this.airlineService.update(id, updateAirlineDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an airline' })
  @ApiParam({ name: 'id', description: 'Airline ID' })
  @ApiResponse({ status: 204, description: 'The airline has been deleted' })
  @ApiResponse({ status: 404, description: 'Airline not found' })
  async delete(@Param('id') id: number): Promise<void> {
    return this.airlineService.delete(id);
  }
}
