import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Airline } from '../src/airline/airline.entity';
import { Airport } from '../src/airport/airport.entity';
import { CreateAirlineDto } from '../src/airline/dto/create-airline.dto';
import { CreateAirportDto } from '../src/airport/dto/create-airport.dto';
import { UpdateAirportsDto } from '../src/airline-airport/dto/update-airports.dto';

describe('API (e2e)', () => {
  let app: INestApplication;
  let airlineId: number;
  let airportId: number;

  // Fixed: Add merge method to mock repositories
  const mockAirlineRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getMany: jest.fn(),
    })),
  };

  const mockAirportRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getMany: jest.fn(),
    })),
  };

  const createAirlineDto: CreateAirlineDto = {
    name: 'Test Airline',
    description: 'Test Description',
    foundationDate: new Date('2000-01-01'),
    website: 'https://www.testairline.com',
  };

  const createAirportDto: CreateAirportDto = {
    name: 'John F. Kennedy International Airport',
    code: 'JFK',
    country: 'United States',
    city: 'New York',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Airline))
      .useValue(mockAirlineRepository)
      .overrideProvider(getRepositoryToken(Airport))
      .useValue(mockAirportRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    // Mock data for tests
    const airline = {
      id: 1,
      ...createAirlineDto,
      airports: [],
    };
    airlineId = airline.id;

    const airport = {
      id: 1,
      ...createAirportDto,
      airlines: [],
    };
    airportId = airport.id;

    // Set up mocks
    mockAirlineRepository.find.mockResolvedValue([airline]);
    mockAirlineRepository.findOne.mockResolvedValue(airline);
    mockAirlineRepository.create.mockReturnValue(airline);
    mockAirlineRepository.save.mockResolvedValue(airline);
    mockAirlineRepository.merge.mockReturnValue(airline);

    mockAirportRepository.find.mockResolvedValue([airport]);
    mockAirportRepository.findOne.mockResolvedValue(airport);
    mockAirportRepository.create.mockReturnValue(airport);
    mockAirportRepository.save.mockResolvedValue(airport);
    mockAirportRepository.merge.mockReturnValue(airport);

    mockAirlineRepository
      .createQueryBuilder()
      .getMany.mockResolvedValue([airline]);
    mockAirlineRepository
      .createQueryBuilder()
      .getOne.mockResolvedValue(airline);
    mockAirportRepository
      .createQueryBuilder()
      .getMany.mockResolvedValue([airport]);
    mockAirportRepository
      .createQueryBuilder()
      .getOne.mockResolvedValue(airport);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Airlines', () => {
    it('/airlines (GET)', () => {
      return request(app.getHttpServer())
        .get('/airlines')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/airlines/:id (GET)', () => {
      return request(app.getHttpServer())
        .get(`/airlines/${airlineId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('description');
          expect(res.body).toHaveProperty('foundationDate');
          expect(res.body).toHaveProperty('website');
        });
    });

    it('/airlines (POST)', () => {
      return request(app.getHttpServer())
        .post('/airlines')
        .send(createAirlineDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', createAirlineDto.name);
          expect(res.body).toHaveProperty(
            'description',
            createAirlineDto.description,
          );
          expect(res.body).toHaveProperty('website', createAirlineDto.website);
        });
    });

    it('/airlines/:id (PUT)', () => {
      const updateData = {
        name: 'Updated Airline',
        description: 'Updated Description',
      };

      return request(app.getHttpServer())
        .put(`/airlines/${airlineId}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('description');
        });
    });

    it('/airlines/:id (DELETE)', () => {
      return request(app.getHttpServer())
        .delete(`/airlines/${airlineId}`)
        .expect(204);
    });
  });

  describe('Airports', () => {
    it('/airports (GET)', () => {
      return request(app.getHttpServer())
        .get('/airports')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/airports/:id (GET)', () => {
      return request(app.getHttpServer())
        .get(`/airports/${airportId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('code');
          expect(res.body).toHaveProperty('country');
          expect(res.body).toHaveProperty('city');
        });
    });

    it('/airports (POST)', () => {
      return request(app.getHttpServer())
        .post('/airports')
        .send(createAirportDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', createAirportDto.name);
          expect(res.body).toHaveProperty('code', createAirportDto.code);
          expect(res.body).toHaveProperty('country', createAirportDto.country);
          expect(res.body).toHaveProperty('city', createAirportDto.city);
        });
    });

    it('/airports/:id (PUT)', () => {
      const updateData = {
        name: 'Updated Airport',
        city: 'Updated City',
      };

      return request(app.getHttpServer())
        .put(`/airports/${airportId}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('city');
        });
    });

    it('/airports/:id (DELETE)', () => {
      return request(app.getHttpServer())
        .delete(`/airports/${airportId}`)
        .expect(204);
    });
  });

  describe('Airlines-Airports Association', () => {
    it('/airlines/:airlineId/airports/:airportId (POST)', () => {
      return request(app.getHttpServer())
        .post(`/airlines/${airlineId}/airports/${airportId}`)
        .expect(201) // Default status code for POST is 201
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('airports');
        });
    });

    it('/airlines/:airlineId/airports (GET)', () => {
      return request(app.getHttpServer())
        .get(`/airlines/${airlineId}/airports`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });

    it('/airlines/:airlineId/airports/:airportId (GET)', () => {
      return request(app.getHttpServer())
        .get(`/airlines/${airlineId}/airports/${airportId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('code');
        });
    });

    it('/airlines/:airlineId/airports (PUT)', () => {
      const updateData: UpdateAirportsDto = {
        airportIds: [1, 2],
      };

      return request(app.getHttpServer())
        .put(`/airlines/${airlineId}/airports`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('airports');
        });
    });

    it('/airlines/:airlineId/airports/:airportId (DELETE)', () => {
      return request(app.getHttpServer())
        .delete(`/airlines/${airlineId}/airports/${airportId}`)
        .expect(204);
    });
  });
});
