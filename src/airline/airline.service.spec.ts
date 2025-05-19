import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirlineService } from './airline.service';
import { Airline } from './airline.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<Airline>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const airlineMock: Airline = {
    id: 1,
    name: 'Test Airline',
    description: 'Test Description',
    foundationDate: new Date('2000-01-01'),
    website: 'https://www.testairline.com',
    airports: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirlineService,
        {
          provide: getRepositoryToken(Airline),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<Airline>>(getRepositoryToken(Airline));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of airlines', async () => {
      const airlines = [airlineMock];
      mockRepository.find.mockResolvedValue(airlines);

      const result = await service.findAll();
      expect(result).toEqual(airlines);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['airports'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single airline', async () => {
      mockRepository.findOne.mockResolvedValue(airlineMock);

      const result = await service.findOne(1);
      expect(result).toEqual(airlineMock);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['airports'],
      });
    });

    it('should throw NotFoundException when airline not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new airline', async () => {
      const createDto: CreateAirlineDto = {
        name: 'New Airline',
        description: 'New Description',
        foundationDate: new Date('2000-01-01'),
        website: 'https://www.newairline.com',
      };

      const newAirline = { ...createDto, id: 2, airports: [] };

      mockRepository.create.mockReturnValue(newAirline);
      mockRepository.save.mockResolvedValue(newAirline);

      const result = await service.create(createDto);

      expect(result).toEqual(newAirline);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(newAirline);
    });

    it('should throw BadRequestException when foundation date is in the future', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const createDto: CreateAirlineDto = {
        name: 'New Airline',
        description: 'New Description',
        foundationDate: futureDate,
        website: 'https://www.newairline.com',
      };

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return the airline', async () => {
      const updateDto: UpdateAirlineDto = {
        name: 'Updated Airline',
      };

      const updatedAirline = { ...airlineMock, name: 'Updated Airline' };

      mockRepository.findOne.mockResolvedValue(airlineMock);
      mockRepository.merge.mockReturnValue(updatedAirline);
      mockRepository.save.mockResolvedValue(updatedAirline);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedAirline);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['airports'],
      });
      expect(mockRepository.merge).toHaveBeenCalledWith(airlineMock, updateDto);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedAirline);
    });

    it('should throw BadRequestException when foundation date is in the future', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const updateDto: UpdateAirlineDto = {
        foundationDate: futureDate,
      };

      mockRepository.findOne.mockResolvedValue(airlineMock);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.merge).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should remove the airline', async () => {
      mockRepository.findOne.mockResolvedValue(airlineMock);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.delete(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['airports'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(airlineMock);
    });
  });
});
