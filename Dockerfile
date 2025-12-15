FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]

