FROM node:19.5.0-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev  
COPY . .
RUN npx tsc

FROM node:19.5.0-alpine AS runtime
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json package-lock.json ./

CMD ["node", "dist/index.js"]
