FROM node:alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i && npm install typescript -g
CMD ["npm", "run", "start"]
