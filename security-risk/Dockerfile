# Fase de construcción (build)
FROM node:20-slim as builder

WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# <<-- CAMBIO CLAVE AQUÍ: De 'npm ci --omit=dev' a 'npm install' -->>
RUN npm install --production --force # <<-- Usar npm install y --force para más robustez en el build
# Opcional: si esto no funciona, podemos intentar npm install directamente sin --production --force
# RUN npm install

# Copia el resto del código fuente de React
COPY . .

# Construye la aplicación React para producción
RUN npm run build

# Fase de producción (serving)
FROM node:20-slim

WORKDIR /usr/src/app

RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 8080

CMD ["sh", "-c", "serve -s build -l tcp://0.0.0.0:${PORT}"]