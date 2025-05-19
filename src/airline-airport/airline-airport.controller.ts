import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AirlineAirportService } from './airline-airport.service';
import { Airline } from '../airline/airline.entity';
import { Airport } from '../airport/airport.entity';
import { UpdateAirportsDto } from './dto/update-airports.dto';

@ApiTags('airlines-airports')
@Controller('airlines/:airlineId/airports')
@UseInterceptors(ClassSerializerInterceptor)
export class AirlineAirportController {
  constructor(private readonly airlineAirportService: AirlineAirportService) {}

  @Post(':airportId')
  @ApiOperation({ summary: 'Associate an airport with an airline' })
  @ApiParam({ name: 'airlineId', description: 'Airline ID' })
  @ApiParam({ name: 'airportId', description: 'Airport ID' })
  @ApiResponse({
    status: 200,
    description: 'The airport has been associated with the airline',
    type: Airline,
  })
  @ApiResponse({ status: 404, description: 'Airline or airport not found' })
  async addAirportToAirline(
    @Param('airlineId') airlineId: number,
    @Param('airportId') airportId: number,
  ): Promise<Airline> {
    return this.airlineAirportService.addAirportToAirline(airlineId, airportId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all airports for an airline' })
  @ApiParam({ name: 'airlineId', description: 'Airline ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all airports for the airline',
    type: [Airport],
  })
  @ApiResponse({ status: 404, description: 'Airline not found' })
  async findAirportsFromAirline(
    @Param('airlineId') airlineId: number,
  ): Promise<Airport[]> {
    return this.airlineAirportService.findAirportsFromAirline(airlineId);
  }

  @Get(':airportId')
  @ApiOperation({ summary: 'Get a specific airport for an airline' })
  @ApiParam({ name: 'airlineId', description: 'Airline ID' })
  @ApiParam({ name: 'airportId', description: 'Airport ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the airport',
    type: Airport,
  })
  @ApiResponse({ status: 404, description: 'Airline or airport not found' })
  async findAirportFromAirline(
    @Param('airlineId') airlineId: number,
    @Param('airportId') airportId: number,
  ): Promise<Airport> {
    return this.airlineAirportService.findAirportFromAirline(
      airlineId,
      airportId,
    );
  }

  @Put()
  @ApiOperation({ summary: 'Update airports for an airline' })
  @ApiParam({ name: 'airlineId', description: 'Airline ID' })
  @ApiResponse({
    status: 200,
    description: 'The airports have been updated',
    type: Airline,
  })
  @ApiResponse({ status: 404, description: 'Airline or airport not found' })
  async updateAirportsFromAirline(
    @Param('airlineId') airlineId: number,
    @Body() updateAirportsDto: UpdateAirportsDto,
  ): Promise<Airline> {
    return this.airlineAirportService.updateAirportsFromAirline(
      airlineId,
      updateAirportsDto.airportIds,
    );
  }

  @Delete(':airportId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove an airport from an airline' })
  @ApiParam({ name: 'airlineId', description: 'Airline ID' })
  @ApiParam({ name: 'airportId', description: 'Airport ID' })
  @ApiResponse({
    status: 204,
    description: 'The airport has been removed from the airline',
  })
  @ApiResponse({ status: 404, description: 'Airline or airport not found' })
  async deleteAirportFromAirline(
    @Param('airlineId') airlineId: number,
    @Param('airportId') airportId: number,
  ): Promise<Airline> {
    return this.airlineAirportService.deleteAirportFromAirline(
      airlineId,
      airportId,
    );
  }
}
