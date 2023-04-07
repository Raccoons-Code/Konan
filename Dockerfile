FROM node:18

RUN npm i -g pm2

RUN mkdir /usr/app && chown -R node:node /usr/app
WORKDIR /usr/app

COPY . .
RUN yarn
RUN npm run build

USER node
ENV NODE_ENV=production
CMD ["pm2-runtime", "process.yml", "--only", "konan"]
