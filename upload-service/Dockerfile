# Stage 1: Build
FROM node:19.5.0-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev  
COPY . .
RUN npx tsc

FROM node:19.5.0-alpine AS runtime
RUN apk add --no-cache git
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json package-lock.json ./

EXPOSE 3000
CMD ["node", "dist/index.js"]