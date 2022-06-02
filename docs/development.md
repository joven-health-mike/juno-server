# Development

- [Authentication](#authentication)
- [Components](#components)
- [Configurations](#configurations)
  - [Environment Variables](#environment-variables)
- [Logging](#logging)
- [Makefile](#makefile)
- [Router](#router)
- [Testing](#testing)

## Authentication

TODO

## Components

TODO

## Configurations

Project configurations can be managed using environment variables or the configuration files found in `./config/`. Configuration files are loaded ([in a specific order](https://github.com/lorenwest/node-config/wiki/Configuration-Files#file-load-order)) by the [node-config](https://github.com/lorenwest/node-config) module.

When working locally you can override any configuration by creating a `./config/local.js` file, for example:

```js
module.exports = {
  port: 3000
}
```

The `./config/local.js` file will not be tracked by Git to prevent accidentially committing secrets or machine specific configurations.

### Environment Variables

TODO

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
