import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airline } from './airline.entity';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(Airline)
    private readonly airlineRepository: Repository<Airline>,
  ) {}

  async findAll(): Promise<Airline[]> {
    return await this.airlineRepository.find({ relations: ['airports'] });
  }

  async findOne(id: number): Promise<Airline> {
    const airline = await this.airlineRepository.findOne({
      where: { id },
      relations: ['airports'],
    });

    if (!airline) {
      throw new NotFoundException(`Airline with ID ${id} not found`);
    }

    return airline;
  }

  async create(createAirlineDto: CreateAirlineDto): Promise<Airline> {
    // Validate foundation date is in the past
    if (new Date(createAirlineDto.foundationDate) > new Date()) {
      throw new BadRequestException('Foundation date must be in the past');
    }

    const airline = this.airlineRepository.create(createAirlineDto);
    return await this.airlineRepository.save(airline);
  }

  async update(
    id: number,
    updateAirlineDto: UpdateAirlineDto,
  ): Promise<Airline> {
    const airline = await this.findOne(id);

    // Validate foundation date is in the past if provided
    if (
      updateAirlineDto.foundationDate &&
      new Date(updateAirlineDto.foundationDate) > new Date()
    ) {
      throw new BadRequestException('Foundation date must be in the past');
    }

    const updatedAirline = this.airlineRepository.merge(
      airline,
      updateAirlineDto,
    );
    return await this.airlineRepository.save(updatedAirline);
  }

  async delete(id: number): Promise<void> {
    const airline = await this.findOne(id);
    await this.airlineRepository.remove(airline);
  }
}
