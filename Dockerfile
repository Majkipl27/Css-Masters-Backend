FROM node:18
WORKDIR /app

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./prisma ./

RUN pnpm i
RUN pnpm build

COPY . .

EXPOSE 3000

CMD [ "pnpm", "start:prod" ]