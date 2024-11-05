# Use a imagem base do Node.js
FROM node:16

# Instale o http-server
RUN npm install -g http-server

# Defina o diretório de trabalho
WORKDIR /app

# Copie todos os arquivos do diretório atual para o contêiner
COPY . .

# Exponha a porta que o http-server usará
EXPOSE 8080

# Comando para iniciar o servidor
CMD ["http-server", "-p", "8080"]
