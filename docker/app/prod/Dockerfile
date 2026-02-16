# Stage 1: Build the app (SvelteKit + adapter-node)
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json /app/
COPY svelte.config.js vite.config.ts /app/

RUN npm ci

COPY . /app

ENV NODE_ENV=production
RUN npm run build
# Outputs to /app/build

# Stage 2: Production runtime
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# So SvelteKit sees the correct origin when behind nginx
ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host
ENV PORT_HEADER=x-forwarded-port
ENV ADDRESS_HEADER=x-forwarded-for

COPY package*.json /app/
RUN npm ci --omit=dev --omit=optional && npm cache clean --force

COPY --from=builder /app/build /app/build

EXPOSE 3000

CMD ["node", "build"]
