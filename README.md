# Create Node App

- [Getting Started](#getting-started)
- [Development](#development)
  - [Authentication](#authentication)
  - [Components](#components)
    - [`/appointments`](#appointments)
    - [`/schools`](#schools)
    - [`/users`](#users)
  - [Configurations](#configurations)
    - [Environment Variables](#environment-variables)
  - [Database](#database)
    - [Deploying a Fresh Database](#deploying-a-fresh-database)
  - [Logging](#logging)
  - [Makefile](#makefile)
  - [Router](#router)
  - [Testing](#testing)
- [Production Build](#production-build)

# Getting Started

1. Install the project's dependencies

   ```bash
   make install
   ```

2. Start the SSL Proxy (Caddy)

   ```bash
   make start-proxy
   ```

3. Start the server

   ```bash
   make start
   ```

3. You can now make API requests to the server

   ```bash
   curl -H "Content-Type: application/json" "https://localhost/api/1/users"
   ```

# Development

## Authentication

You can log in to the application at `https://localhost/api/1/login`. If you don't have credentials to log in, please contact `mike@jovenhealth.com`.

## Components

### `/appointments`

API to interact with the appointments database table.

GET /appointments - returns a list of all appointments
GET /appointments/:ID - returns a specific appointment by ID
POST /appointments - adds a new appointment
PUT /appointments/:ID - updates an existing appointment by ID
DELETE /appointments/:ID - deletes an appointment by ID

### `/schools`

API to interact with the schools database table.

GET /schools - returns a list of all schools
GET /schools/:ID - returns a specific school by ID
POST /schools - adds a new school
PUT /schools/:ID - updates an existing school by ID
DELETE /schools/:ID - deletes an school by ID

### `/users`

API to interact with the users database table.

GET /users - returns a list of all users
GET /loggedInUser - returns the logged-in user
GET /users/:ID - returns a specific user by ID
GET /users/roles/:role - returns a list of users by role
POST /users - adds a new user
PUT /users/:ID - updates an existing user by ID
DELETE /users/:ID - deletes an user by ID

## Configurations

Project configurations can be managed using environment variables or configuration files found in `./config/`. Configuration files are loaded ([in a specific order](https://github.com/lorenwest/node-config/wiki/Configuration-Files#file-load-order)) by the [node-config](https://github.com/lorenwest/node-config) module.

When working locally you can override any configuration by creating a `./config/local.js` file, for example:

```js
module.exports = {
  port: 3000
}
```

### Environment Variables

TODO

## Database

The application uses Prisma to implement a postgresql database. The database schema is defined in the `/prisma` folder. There is a separate schema defined for local, production, and development environments.

### Deploying a Fresh Database

0. Prepare the environment for database migration.
  You only need to do this once, not every time you want to deploy a fresh db

  - [Install Docker](https://docs.docker.com/get-docker/)
  - Run `make docker-build` to build the Docker container
  - Run `make docker-db` to start postgres in the Docker container

1. Delete the existing database by deleting the "migrations" folder.

  ```bash
   rm -rf ./prisma/migrations
   ```

2. Build the database for the particular environment.

   ```bash
   make db-build-local // local environment
   make db-build-dev // dev environment
   make db-build-prod // prod environment
   ```

3. Migrate and seed the database with initial data.

   ```bash
   make db-migrate-local // local environment
   make db-migrate-dev // dev environment
   make db-migrate-prod // prod environment
   ```

   Press 'Y' to confirm deleting the existing data and 'Enter' to skip entering a name for the migration.

4. Start the server to initiate a connection to the database.

   ```bash
   make start
   ```

5. Launch Prisma Studio.

   ```bash
   make db-ui-local // local environment
   make db-ui-dev // dev environment
   make db-ui-prod // prod environment
   ```

## Logging

All logging is handled by [Pino](https://github.com/pinojs/pino#readme).

## Makefile

The main purpose of a Makefile (traditionally) has been to document and automate the procedure to compile software. With a Makefile developers do not type lengthy, error prone, commands. Instead they type `make` or `make build`. The Makefile is checked into version control where it acts as a type of Documentation, recording the exact steps required to compile the software.

However the Makefile, and all of it's benefits, are not limited to compiling software. A Makefile can have many commands and execute them to perform any type of task. Therefore we choose to use a Makefile to automate and document all of our commonly used commands.

Run the command `make` or `make list` for a list of available commands. Or you can reference the `Makefile`.

## Router

TODO

## Testing

Run the command `make test` to test the entire project.

# Production Build

This application will be deployed as a Docker container. You can build and run a production image locally using the command:

```
make docker-start
```

To stop the container use the command:

```
make docker-stop
```

While debugging an issue with a Docker container you may also find the following commands useful:

- `make build` - Compile the typescript into javascript
- `make docker-build` - Build a new docker image
- `make docker-build-no-cache` - Build a new docker images without using any cached layers or files

Reference the [Makefile](#makefile) for other available commands.
