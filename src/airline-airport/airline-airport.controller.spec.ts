import { Test, TestingModule } from '@nestjs/testing';
import { AirlineAirportController } from './airline-airport.controller';
import { AirlineAirportService } from './airline-airport.service';
import { Airline } from '../airline/airline.entity';
import { Airport } from '../airport/airport.entity';
import { UpdateAirportsDto } from './dto/update-airports.dto';
import { NotFoundException } from '@nestjs/common';

describe('AirlineAirportController', () => {
  let controller: AirlineAirportController;
  let service: AirlineAirportService;

  const airportMock: Airport = {
    id: 1,
    name: 'John F. Kennedy International Airport',
    code: 'JFK',
    country: 'United States',
    city: 'New York',
    airlines: [],
  };

  const airport2Mock: Airport = {
    id: 2,
    name: 'LaGuardia Airport',
    code: 'LGA',
    country: 'United States',
    city: 'New York',
    airlines: [],
  };

  const airlineMock: Airline = {
    id: 1,
    name: 'Test Airline',
    description: 'Test Description',
    foundationDate: new Date('2000-01-01'),
    website: 'https://www.testairline.com',
    airports: [airportMock],
  };

  const updateAirportsDto: UpdateAirportsDto = {
    airportIds: [1, 2],
  };

  const mockAirlineAirportService = {
    addAirportToAirline: jest.fn(),
    findAirportsFromAirline: jest.fn(),
    findAirportFromAirline: jest.fn(),
    updateAirportsFromAirline: jest.fn(),
    deleteAirportFromAirline: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirlineAirportController],
      providers: [
        {
          provide: AirlineAirportService,
          useValue: mockAirlineAirportService,
        },
      ],
    }).compile();

    controller = module.get<AirlineAirportController>(AirlineAirportController);
    service = module.get<AirlineAirportService>(AirlineAirportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addAirportToAirline', () => {
    it('should add an airport to an airline', async () => {
      mockAirlineAirportService.addAirportToAirline.mockResolvedValue(
        airlineMock,
      );

      const result = await controller.addAirportToAirline(1, 1);
      expect(result).toEqual(airlineMock);
      expect(service.addAirportToAirline).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException if airline or airport not found', async () => {
      mockAirlineAirportService.addAirportToAirline.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.addAirportToAirline(999, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.addAirportToAirline).toHaveBeenCalledWith(999, 1);
    });
  });

  describe('findAirportsFromAirline', () => {
    it('should return all airports for an airline', async () => {
      mockAirlineAirportService.findAirportsFromAirline.mockResolvedValue([
        airportMock,
      ]);

      const result = await controller.findAirportsFromAirline(1);
      expect(result).toEqual([airportMock]);
      expect(service.findAirportsFromAirline).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if airline not found', async () => {
      mockAirlineAirportService.findAirportsFromAirline.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.findAirportsFromAirline(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findAirportsFromAirline).toHaveBeenCalledWith(999);
    });
  });

  describe('findAirportFromAirline', () => {
    it('should return a specific airport for an airline', async () => {
      mockAirlineAirportService.findAirportFromAirline.mockResolvedValue(
        airportMock,
      );

      const result = await controller.findAirportFromAirline(1, 1);
      expect(result).toEqual(airportMock);
      expect(service.findAirportFromAirline).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException if airline or airport not found', async () => {
      mockAirlineAirportService.findAirportFromAirline.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.findAirportFromAirline(1, 999)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findAirportFromAirline).toHaveBeenCalledWith(1, 999);
    });
  });

  describe('updateAirportsFromAirline', () => {
    it('should update airports for an airline', async () => {
      const updatedAirline = {
        ...airlineMock,
        airports: [airportMock, airport2Mock],
      };
      mockAirlineAirportService.updateAirportsFromAirline.mockResolvedValue(
        updatedAirline,
      );

      const result = await controller.updateAirportsFromAirline(
        1,
        updateAirportsDto,
      );
      expect(result).toEqual(updatedAirline);
      expect(service.updateAirportsFromAirline).toHaveBeenCalledWith(
        1,
        updateAirportsDto.airportIds,
      );
    });

    it('should throw NotFoundException if airline or airport not found', async () => {
      mockAirlineAirportService.updateAirportsFromAirline.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        controller.updateAirportsFromAirline(999, updateAirportsDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.updateAirportsFromAirline).toHaveBeenCalledWith(
        999,
        updateAirportsDto.airportIds,
      );
    });
  });

  describe('deleteAirportFromAirline', () => {
    it('should remove an airport from an airline', async () => {
      const updatedAirline = {
        ...airlineMock,
        airports: [],
      };
      mockAirlineAirportService.deleteAirportFromAirline.mockResolvedValue(
        updatedAirline,
      );

      const result = await controller.deleteAirportFromAirline(1, 1);
      expect(result).toEqual(updatedAirline);
      expect(service.deleteAirportFromAirline).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException if airline or airport not found', async () => {
      mockAirlineAirportService.deleteAirportFromAirline.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.deleteAirportFromAirline(1, 999)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.deleteAirportFromAirline).toHaveBeenCalledWith(1, 999);
    });
  });
});
