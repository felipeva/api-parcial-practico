import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airport } from './airport.entity';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(Airport)
    private readonly airportRepository: Repository<Airport>,
  ) {}

  async findAll(): Promise<Airport[]> {
    return await this.airportRepository.find({ relations: ['airlines'] });
  }

  async findOne(id: number): Promise<Airport> {
    const airport = await this.airportRepository.findOne({
      where: { id },
      relations: ['airlines'],
    });

    if (!airport) {
      throw new NotFoundException(`Airport with ID ${id} not found`);
    }

    return airport;
  }

  async create(createAirportDto: CreateAirportDto): Promise<Airport> {
    // Validate code has exactly 3 characters
    if (createAirportDto.code.length !== 3) {
      throw new BadRequestException(
        'Airport code must be exactly 3 characters',
      );
    }

    const airport = this.airportRepository.create(createAirportDto);
    return await this.airportRepository.save(airport);
  }

  async update(
    id: number,
    updateAirportDto: UpdateAirportDto,
  ): Promise<Airport> {
    const airport = await this.findOne(id);

    // Validate code has exactly 3 characters if provided
    if (updateAirportDto.code && updateAirportDto.code.length !== 3) {
      throw new BadRequestException(
        'Airport code must be exactly 3 characters',
      );
    }

    const updatedAirport = this.airportRepository.merge(
      airport,
      updateAirportDto,
    );
    return await this.airportRepository.save(updatedAirport);
  }

  async delete(id: number): Promise<void> {
    const airport = await this.findOne(id);
    await this.airportRepository.remove(airport);
  }
}
