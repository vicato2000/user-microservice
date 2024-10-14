# Etapa 1: Construcción de la aplicación Angular
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Construye la aplicación Angular Universal (browser build)
RUN npm run build --prod

# Etapa 2: Configuración de Nginx para servir la aplicación Angular
FROM nginx:alpine
# Copiar el build de la aplicación desde la carpeta 'dist/browser'
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
