FROM node:18

RUN mkdir /usr/app && chown -R node:node /usr/app
WORKDIR /usr/app

COPY . .
RUN npm i -g yarn
RUN yarn
RUN npm run build

USER node
ENV NODE_ENV=production
CMD ["npm", "start"]