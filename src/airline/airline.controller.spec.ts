import { Test, TestingModule } from '@nestjs/testing';
import { AirlineController } from './airline.controller';
import { AirlineService } from './airline.service';
import { Airline } from './airline.entity';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AirlineController', () => {
  let controller: AirlineController;
  let service: AirlineService;

  const airlineMock: Airline = {
    id: 1,
    name: 'Test Airline',
    description: 'Test Description',
    foundationDate: new Date('2000-01-01'),
    website: 'https://www.testairline.com',
    airports: [],
  };

  const createAirlineDto: CreateAirlineDto = {
    name: 'New Airline',
    description: 'New Description',
    foundationDate: new Date('2000-01-01'),
    website: 'https://www.newairline.com',
  };

  const updateAirlineDto: UpdateAirlineDto = {
    name: 'Updated Airline',
    description: 'Updated Description',
  };

  const mockAirlineService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirlineController],
      providers: [
        {
          provide: AirlineService,
          useValue: mockAirlineService,
        },
      ],
    }).compile();

    controller = module.get<AirlineController>(AirlineController);
    service = module.get<AirlineService>(AirlineService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of airlines', async () => {
      const airlines = [airlineMock];
      mockAirlineService.findAll.mockResolvedValue(airlines);

      const result = await controller.findAll();
      expect(result).toEqual(airlines);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single airline', async () => {
      mockAirlineService.findOne.mockResolvedValue(airlineMock);

      const result = await controller.findOne(1);
      expect(result).toEqual(airlineMock);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when airline not found', async () => {
      mockAirlineService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create and return a new airline', async () => {
      const newAirline = { ...createAirlineDto, id: 2, airports: [] };
      mockAirlineService.create.mockResolvedValue(newAirline);

      const result = await controller.create(createAirlineDto);
      expect(result).toEqual(newAirline);
      expect(service.create).toHaveBeenCalledWith(createAirlineDto);
    });

    it('should throw BadRequestException for invalid airline data', async () => {
      mockAirlineService.create.mockRejectedValue(new BadRequestException());

      // Create a DTO with future date to test validation
      const invalidDto = { ...createAirlineDto };
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      invalidDto.foundationDate = futureDate;

      await expect(controller.create(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.create).toHaveBeenCalledWith(invalidDto);
    });
  });

  describe('update', () => {
    it('should update and return the airline', async () => {
      const updatedAirline = { ...airlineMock, ...updateAirlineDto };
      mockAirlineService.update.mockResolvedValue(updatedAirline);

      const result = await controller.update(1, updateAirlineDto);
      expect(result).toEqual(updatedAirline);
      expect(service.update).toHaveBeenCalledWith(1, updateAirlineDto);
    });

    it('should throw NotFoundException when airline not found', async () => {
      mockAirlineService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(999, updateAirlineDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(999, updateAirlineDto);
    });

    it('should throw BadRequestException for invalid update data', async () => {
      mockAirlineService.update.mockRejectedValue(new BadRequestException());

      // Update with future date to test validation
      const invalidUpdate = { ...updateAirlineDto };
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      invalidUpdate.foundationDate = futureDate;

      await expect(controller.update(1, invalidUpdate)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.update).toHaveBeenCalledWith(1, invalidUpdate);
    });
  });

  describe('delete', () => {
    it('should delete the airline and return nothing', async () => {
      mockAirlineService.delete.mockResolvedValue(undefined);

      await controller.delete(1);
      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when airline not found', async () => {
      mockAirlineService.delete.mockRejectedValue(new NotFoundException());

      await expect(controller.delete(999)).rejects.toThrow(NotFoundException);
      expect(service.delete).toHaveBeenCalledWith(999);
    });
  });
});
