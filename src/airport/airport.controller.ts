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
import { AirportService } from './airport.service';
import { Airport } from './airport.entity';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';

@ApiTags('airports')
@Controller('airports')
@UseInterceptors(ClassSerializerInterceptor)
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get()
  @ApiOperation({ summary: 'Get all airports' })
  @ApiResponse({
    status: 200,
    description: 'Return all airports',
    type: [Airport],
  })
  async findAll(): Promise<Airport[]> {
    return this.airportService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific airport by ID' })
  @ApiParam({ name: 'id', description: 'Airport ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the airport',
    type: Airport,
  })
  @ApiResponse({ status: 404, description: 'Airport not found' })
  async findOne(@Param('id') id: number): Promise<Airport> {
    return this.airportService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new airport' })
  @ApiResponse({
    status: 201,
    description: 'The airport has been created',
    type: Airport,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(@Body() createAirportDto: CreateAirportDto): Promise<Airport> {
    return this.airportService.create(createAirportDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an airport' })
  @ApiParam({ name: 'id', description: 'Airport ID' })
  @ApiResponse({
    status: 200,
    description: 'The airport has been updated',
    type: Airport,
  })
  @ApiResponse({ status: 404, description: 'Airport not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async update(
    @Param('id') id: number,
    @Body() updateAirportDto: UpdateAirportDto,
  ): Promise<Airport> {
    return this.airportService.update(id, updateAirportDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an airport' })
  @ApiParam({ name: 'id', description: 'Airport ID' })
  @ApiResponse({ status: 204, description: 'The airport has been deleted' })
  @ApiResponse({ status: 404, description: 'Airport not found' })
  async delete(@Param('id') id: number): Promise<void> {
    return this.airportService.delete(id);
  }
}
