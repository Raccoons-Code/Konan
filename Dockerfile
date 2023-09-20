FROM node:lts-alpine

RUN mkdir /usr/app
WORKDIR /usr/app

COPY --chown=node:node . .
RUN npm i -g yarn || true
RUN yarn
RUN npm run build
RUN rm -rf node_modules
RUN yarn --production

USER node
ENV NODE_ENV=production
CMD ["npm", "start"]
