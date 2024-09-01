# Usar uma imagem base do Node.js
FROM node:18

# Definir diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todos os arquivos para o contêiner
COPY . .

# Expor a porta que o aplicativo Node.js usará
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
