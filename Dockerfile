# Base image with Node and pnpm
FROM node:23.6.1-alpine3.21 AS base
RUN npm i -g pnpm@10.2.0

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm fetch --frozen-lockfile && \
    pnpm install --frozen-lockfile --prod --no-optional

# Build the application
FROM base AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm fetch --frozen-lockfile && \
    pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# Production image
FROM base
WORKDIR /app

# Copy only the production node_modules directly from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build

ENTRYPOINT ["node", "build/index.js"]