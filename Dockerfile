FROM node:14.16.1-alpine AS build

# Install system level dependancies required to build the application
RUN apk add --no-cache g++ gcc libgcc libstdc++ linux-headers make python

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
RUN --mount=type=secret,id=npmrc,dst=/root/.npmrc npm ci

# Compile the typescript application and stores the common javascript files in ./build
RUN --mount=type=secret,id=npmrc,dst=/root/.npmrc npm run build

# Remove dependancies from the node_modules folder that is not required for production
RUN npm prune --production


FROM node:14.16.1-alpine

ARG build_version
ENV BUILD_VERSION=${build_version}

WORKDIR /app
RUN  addgroup -g 20001 -S non-root && adduser -S -u 20001 non-root -G non-root

# Add the application's javascript files built in previous layer
COPY --chown=non-root --from=build /app/build/ ./

# Add the application's production depedancies installed in the previous layer
COPY --chown=non-root --from=build /app/node_modules ./node_modules

USER 20001

# Start the node application
CMD ["node", "./src/index.js"]
