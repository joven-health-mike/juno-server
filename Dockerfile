FROM node:18.3.0-alpine AS build

WORKDIR /app

# Add the source code directories
COPY ./config/custom-environment-variables.js ./config/custom-environment-variables.js
COPY ./config/default.js ./config/default.js
COPY ./config/production.js ./config/production.js
COPY ./prisma ./prisma
COPY ./scripts ./scripts
COPY ./src ./src
COPY ./types ./types

# Add the configuration files
COPY ./.eslintrc.js ./.eslintrc.js
COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json

# Install all project dependancies required to build the application
RUN npm ci

# Compile the typescript application and stores the common javascript files in ./build
RUN npm run build

# Remove dependancies from the node_modules folder that is not required for production
RUN npm prune --production


FROM node:18.3.0-alpine

ARG build_version
ENV BUILD_VERSION=${build_version}

# Make sure the application will not start if the config is invalid.
ENV NODE_CONFIG_STRICT_MODE=true

WORKDIR /app
RUN  addgroup -g 20001 -S non-root && adduser -S -u 20001 non-root -G non-root

# Add the application's javascript files built in previous layer
COPY --chown=non-root --from=build /app/build/ ./

# Add application files that were not built by Typescript, but are required
COPY --chown=non-root --from=build ./app/config/custom-environment-variables.js ./config/custom-environment-variables.js
COPY --chown=non-root --from=build ./app/config/default.js ./config/default.js
COPY --chown=non-root --from=build ./app/config/production.js ./config/production.js
COPY --chown=non-root --from=build ./app/prisma ./prisma
COPY --chown=non-root --from=build ./app/package.json ./package.json

# Add the application's production depedancies installed in the previous layer
COPY --chown=non-root --from=build /app/node_modules ./node_modules

USER 20001

# Start the node application
CMD ["node", "./src/index.js"]
