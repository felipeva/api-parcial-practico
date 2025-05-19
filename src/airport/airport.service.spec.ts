import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirportService } from './airport.service';
import { Airport } from './airport.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<Airport>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const airportMock: Airport = {
    id: 1,
    name: 'John F. Kennedy International Airport',
    code: 'JFK',
    country: 'United States',
    city: 'New York',
    airlines: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirportService,
        {
          provide: getRepositoryToken(Airport),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<Airport>>(getRepositoryToken(Airport));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of airports', async () => {
      const airports = [airportMock];
      mockRepository.find.mockResolvedValue(airports);

      const result = await service.findAll();
      expect(result).toEqual(airports);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['airlines'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single airport', async () => {
      mockRepository.findOne.mockResolvedValue(airportMock);

      const result = await service.findOne(1);
      expect(result).toEqual(airportMock);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['airlines'],
      });
    });

    it('should throw NotFoundException when airport not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new airport', async () => {
      const createDto: CreateAirportDto = {
        name: 'LaGuardia Airport',
        code: 'LGA',
        country: 'United States',
        city: 'New York',
      };

      const newAirport = { ...createDto, id: 2, airlines: [] };

      mockRepository.create.mockReturnValue(newAirport);
      mockRepository.save.mockResolvedValue(newAirport);

      const result = await service.create(createDto);

      expect(result).toEqual(newAirport);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(newAirport);
    });

    it('should throw BadRequestException when code is not exactly 3 characters', async () => {
      const createDto: CreateAirportDto = {
        name: 'Invalid Airport',
        code: 'INVALID', // 7 characters
        country: 'United States',
        city: 'New York',
      };

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return the airport', async () => {
      const updateDto: UpdateAirportDto = {
        name: 'Updated Airport',
      };

      const updatedAirport = { ...airportMock, name: 'Updated Airport' };

      mockRepository.findOne.mockResolvedValue(airportMock);
      mockRepository.merge.mockReturnValue(updatedAirport);
      mockRepository.save.mockResolvedValue(updatedAirport);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedAirport);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['airlines'],
      });
      expect(mockRepository.merge).toHaveBeenCalledWith(airportMock, updateDto);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedAirport);
    });

    it('should throw BadRequestException when code is not exactly 3 characters', async () => {
      const updateDto: UpdateAirportDto = {
        code: 'INVALID', // 7 characters
      };

      mockRepository.findOne.mockResolvedValue(airportMock);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.merge).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should remove the airport', async () => {
      mockRepository.findOne.mockResolvedValue(airportMock);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.delete(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['airlines'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(airportMock);
    });
  });
});
