# Keep in sync with .node-version (strip leading v)
ARG NODE_VERSION=26.12.1

# Stage 1: Build the app (SvelteKit + adapter-node)
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig*.json vite.config.ts .npmrc ./

RUN npm ci --prefer-offline

COPY . /app

# Compose env_file applies only when the container starts. Kit validates these
# while analysing routes, and Vite reads them from the build environment.
ARG VITE_BACKEND_URL
ARG VITE_FRONTEND_URL
ARG VITE_API_BASE_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL \
	VITE_FRONTEND_URL=$VITE_FRONTEND_URL \
	VITE_API_BASE_URL=$VITE_API_BASE_URL

ENV NODE_ENV=production
RUN npm run build
# Outputs to /app/build

# Stage 2: Production runtime
FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# So SvelteKit sees the correct origin when behind nginx
ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host
ENV PORT_HEADER=x-forwarded-port
ENV ADDRESS_HEADER=x-forwarded-for

COPY package*.json .npmrc ./
RUN npm ci --prefer-offline --omit=dev --omit=optional --ignore-scripts && npm cache clean --force

COPY --from=builder /app/build /app/build

EXPOSE 3000

CMD ["node", "build"]
