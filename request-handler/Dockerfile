# Stage 1: Build
FROM node:19.5.0-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN NODE_ENV=development npm i
COPY . .
RUN npx tsc

# Stage 2: Run
FROM node:19.5.0-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./
RUN NODE_ENV=development npm i

EXPOSE 3001
CMD ["node", "dist/index.js"]