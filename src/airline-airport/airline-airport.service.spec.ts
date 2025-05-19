import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { AirlineService } from '../airline/airline.service';
import { AirportService } from '../airport/airport.service';
import { Airline } from '../airline/airline.entity';
import { Airport } from '../airport/airport.entity';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineService: AirlineService;
  let airportService: AirportService;

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
    airports: [],
  };

  const airlineWithAirportsMock: Airline = {
    ...airlineMock,
    airports: [airportMock],
  };

  const mockAirlineService = {
    findOne: jest.fn(),
    airlineRepository: {
      save: jest.fn(),
    },
  };

  const mockAirportService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirlineAirportService,
        {
          provide: AirlineService,
          useValue: mockAirlineService,
        },
        {
          provide: AirportService,
          useValue: mockAirportService,
        },
      ],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineService = module.get<AirlineService>(AirlineService);
    airportService = module.get<AirportService>(AirportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addAirportToAirline', () => {
    it('should add an airport to an airline', async () => {
      mockAirlineService.findOne.mockResolvedValue({
        ...airlineMock,
        airports: [],
      });
      mockAirportService.findOne.mockResolvedValue(airportMock);
      mockAirlineService.airlineRepository.save.mockResolvedValue({
        ...airlineMock,
        airports: [airportMock],
      });

      const result = await service.addAirportToAirline(1, 1);

      expect(result.airports).toContainEqual(airportMock);
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirportService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirlineService.airlineRepository.save).toHaveBeenCalled();
    });

    it('should not add duplicate airport to an airline', async () => {
      mockAirlineService.findOne.mockResolvedValue(airlineWithAirportsMock);
      mockAirportService.findOne.mockResolvedValue(airportMock);

      const result = await service.addAirportToAirline(1, 1);

      expect(result.airports).toHaveLength(1);
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirportService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirlineService.airlineRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAirportsFromAirline', () => {
    it('should return all airports for an airline', async () => {
      mockAirlineService.findOne.mockResolvedValue(airlineWithAirportsMock);

      const result = await service.findAirportsFromAirline(1);

      expect(result).toEqual([airportMock]);
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return empty array if airline has no airports', async () => {
      mockAirlineService.findOne.mockResolvedValue({
        ...airlineMock,
        airports: [],
      });

      const result = await service.findAirportsFromAirline(1);

      expect(result).toEqual([]);
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findAirportFromAirline', () => {
    it('should return a specific airport from an airline', async () => {
      mockAirlineService.findOne.mockResolvedValue(airlineWithAirportsMock);

      const result = await service.findAirportFromAirline(1, 1);

      expect(result).toEqual(airportMock);
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if airport is not found in airline', async () => {
      mockAirlineService.findOne.mockResolvedValue(airlineWithAirportsMock);

      await expect(service.findAirportFromAirline(1, 999)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('updateAirportsFromAirline', () => {
    it('should update the airports of an airline', async () => {
      mockAirlineService.findOne.mockResolvedValue(airlineWithAirportsMock);
      mockAirportService.findOne
        .mockResolvedValueOnce(airportMock)
        .mockResolvedValueOnce(airport2Mock);
      mockAirlineService.airlineRepository.save.mockResolvedValue({
        ...airlineMock,
        airports: [airportMock, airport2Mock],
      });

      const result = await service.updateAirportsFromAirline(1, [1, 2]);

      expect(result.airports).toHaveLength(2);
      expect(result.airports).toContainEqual(airportMock);
      expect(result.airports).toContainEqual(airport2Mock);
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirportService.findOne).toHaveBeenCalledTimes(2);
      expect(mockAirlineService.airlineRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if an airport is not found', async () => {
      mockAirlineService.findOne.mockResolvedValue(airlineWithAirportsMock);
      mockAirportService.findOne
        .mockResolvedValueOnce(airportMock)
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        service.updateAirportsFromAirline(1, [1, 999]),
      ).rejects.toThrow(NotFoundException);
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirportService.findOne).toHaveBeenCalledTimes(2);
      expect(mockAirlineService.airlineRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteAirportFromAirline', () => {
    it('should remove an airport from an airline', async () => {
      mockAirlineService.findOne.mockResolvedValue({
        ...airlineMock,
        airports: [{ ...airportMock }],
      });
      mockAirportService.findOne.mockResolvedValue(airportMock);
      mockAirlineService.airlineRepository.save.mockResolvedValue({
        ...airlineMock,
        airports: [],
      });

      const result = await service.deleteAirportFromAirline(1, 1);

      expect(result.airports).toHaveLength(0);
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirportService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirlineService.airlineRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if the airport is not associated with the airline', async () => {
      mockAirlineService.findOne.mockResolvedValue({
        ...airlineMock,
        airports: [],
      });
      mockAirportService.findOne.mockResolvedValue(airportMock);

      await expect(service.deleteAirportFromAirline(1, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirportService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirlineService.airlineRepository.save).not.toHaveBeenCalled();
    });
  });
});
