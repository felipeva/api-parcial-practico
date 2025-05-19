import { Test, TestingModule } from '@nestjs/testing';
import { AirportController } from './airport.controller';
import { AirportService } from './airport.service';
import { Airport } from './airport.entity';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AirportController', () => {
  let controller: AirportController;
  let service: AirportService;

  const airportMock: Airport = {
    id: 1,
    name: 'John F. Kennedy International Airport',
    code: 'JFK',
    country: 'United States',
    city: 'New York',
    airlines: [],
  };

  const createAirportDto: CreateAirportDto = {
    name: 'LaGuardia Airport',
    code: 'LGA',
    country: 'United States',
    city: 'New York',
  };

  const updateAirportDto: UpdateAirportDto = {
    name: 'Updated Airport',
    city: 'Updated City',
  };

  const mockAirportService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirportController],
      providers: [
        {
          provide: AirportService,
          useValue: mockAirportService,
        },
      ],
    }).compile();

    controller = module.get<AirportController>(AirportController);
    service = module.get<AirportService>(AirportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of airports', async () => {
      const airports = [airportMock];
      mockAirportService.findAll.mockResolvedValue(airports);

      const result = await controller.findAll();
      expect(result).toEqual(airports);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single airport', async () => {
      mockAirportService.findOne.mockResolvedValue(airportMock);

      const result = await controller.findOne(1);
      expect(result).toEqual(airportMock);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when airport not found', async () => {
      mockAirportService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create and return a new airport', async () => {
      const newAirport = { ...createAirportDto, id: 2, airlines: [] };
      mockAirportService.create.mockResolvedValue(newAirport);

      const result = await controller.create(createAirportDto);
      expect(result).toEqual(newAirport);
      expect(service.create).toHaveBeenCalledWith(createAirportDto);
    });

    it('should throw BadRequestException for invalid airport data', async () => {
      mockAirportService.create.mockRejectedValue(new BadRequestException());

      // Create a DTO with invalid code to test validation
      const invalidDto = { ...createAirportDto, code: 'INVALID' }; // More than 3 characters

      await expect(controller.create(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.create).toHaveBeenCalledWith(invalidDto);
    });
  });

  describe('update', () => {
    it('should update and return the airport', async () => {
      const updatedAirport = { ...airportMock, ...updateAirportDto };
      mockAirportService.update.mockResolvedValue(updatedAirport);

      const result = await controller.update(1, updateAirportDto);
      expect(result).toEqual(updatedAirport);
      expect(service.update).toHaveBeenCalledWith(1, updateAirportDto);
    });

    it('should throw NotFoundException when airport not found', async () => {
      mockAirportService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(999, updateAirportDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(999, updateAirportDto);
    });

    it('should throw BadRequestException for invalid update data', async () => {
      mockAirportService.update.mockRejectedValue(new BadRequestException());

      // Update with invalid code to test validation
      const invalidUpdate = { ...updateAirportDto, code: 'INVALID' }; // More than 3 characters

      await expect(controller.update(1, invalidUpdate)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.update).toHaveBeenCalledWith(1, invalidUpdate);
    });
  });

  describe('delete', () => {
    it('should delete the airport and return nothing', async () => {
      mockAirportService.delete.mockResolvedValue(undefined);

      await controller.delete(1);
      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when airport not found', async () => {
      mockAirportService.delete.mockRejectedValue(new NotFoundException());

      await expect(controller.delete(999)).rejects.toThrow(NotFoundException);
      expect(service.delete).toHaveBeenCalledWith(999);
    });
  });
});
