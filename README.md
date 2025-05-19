# Airlines Coverage API

An API for managing airlines and airports coverage information.

## Description

This project is a NestJS application that provides a REST API for managing airlines, airports, and their associations. It allows users to track which airports are covered by each airline.

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Docker and Docker Compose

## Project setup

1. Clone the repository:
```bash
$ git clone <repository-url>
$ cd api-project
```

2. Install dependencies:
```bash
$ pnpm install
```

3. Start the PostgreSQL database using Docker:
```bash
$ docker-compose up -d
```

## Database Configuration

The application uses PostgreSQL as its database. Configuration is handled through environment variables:

1. Copy the example environment file:
```bash
$ cp .env.example .env
```

2. Edit the `.env` file to match your database settings if needed:
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=airlines_db
PORT=3000
NODE_ENV=development
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## API Documentation

Once the application is running, you can access the Swagger UI documentation at:

```
http://localhost:3000/api/docs
```

## Project Structure

- `src/airline`: Contains airline entity, service, controller, and tests
- `src/airport`: Contains airport entity, service, controller, and tests
- `src/airline-airport`: Contains association logic, service, controller, and tests
- `collections`: Contains Postman collections for testing the API

## License

This project is [MIT licensed](LICENSE).