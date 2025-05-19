import { Injectable, NotFoundException } from '@nestjs/common';
import { AirlineService } from '../airline/airline.service';
import { AirportService } from '../airport/airport.service';
import { Airline } from '../airline/airline.entity';
import { Airport } from '../airport/airport.entity';

@Injectable()
export class AirlineAirportService {
  constructor(
    private readonly airlineService: AirlineService,
    private readonly airportService: AirportService,
  ) {}

  async addAirportToAirline(
    airlineId: number,
    airportId: number,
  ): Promise<Airline> {
    const airline = await this.airlineService.findOne(airlineId);
    const airport = await this.airportService.findOne(airportId);

    if (!airline.airports) {
      airline.airports = [];
    }

    // Check if the airport is already associated with the airline
    const exists = airline.airports.some((ap) => ap.id === airport.id);

    if (!exists) {
      airline.airports.push(airport);
      await this.airlineService['airlineRepository'].save(airline);
    }

    return airline;
  }

  async findAirportsFromAirline(airlineId: number): Promise<Airport[]> {
    const airline = await this.airlineService.findOne(airlineId);
    return airline.airports;
  }

  async findAirportFromAirline(
    airlineId: number,
    airportId: number,
  ): Promise<Airport> {
    const airline = await this.airlineService.findOne(airlineId);

    const airport = airline.airports.find(
      (airport) => airport.id === airportId,
    );

    if (!airport) {
      throw new NotFoundException(
        `Airport with ID ${airportId} not found in the airline with ID ${airlineId}`,
      );
    }

    return airport;
  }

  async updateAirportsFromAirline(
    airlineId: number,
    airportIds: number[],
  ): Promise<Airline> {
    const airline = await this.airlineService.findOne(airlineId);

    // Validate all airport IDs exist
    const airports = await Promise.all(
      airportIds.map(async (id) => {
        try {
          return await this.airportService.findOne(id);
        } catch (error) {
          throw new NotFoundException(`Airport with ID ${id} not found`);
        }
      }),
    );

    airline.airports = airports;
    return await this.airlineService['airlineRepository'].save(airline);
  }

  async deleteAirportFromAirline(
    airlineId: number,
    airportId: number,
  ): Promise<Airline> {
    const airline = await this.airlineService.findOne(airlineId);
    const airport = await this.airportService.findOne(airportId);

    // Check if the airport is associated with the airline
    const airportIndex = airline.airports.findIndex(
      (ap) => ap.id === airport.id,
    );

    if (airportIndex === -1) {
      throw new NotFoundException(
        `Airport with ID ${airportId} not found in the airline with ID ${airlineId}`,
      );
    }

    airline.airports.splice(airportIndex, 1);
    return await this.airlineService['airlineRepository'].save(airline);
  }
}
