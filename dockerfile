# Usa una imagen base oficial
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia y instala dependencias
COPY package*.json ./
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto NestJS
EXPOSE 3000

# Usa nodemon con ts-node en modo desarrollo
CMD ["npm", "run", "start:dev:docker"]

