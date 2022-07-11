FROM node:16 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm install --save @nestjs/passport passport passport-local passport-kakao
CMD ["npm", "run", "start:dev"]
