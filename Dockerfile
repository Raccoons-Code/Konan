FROM node:18

RUN mkdir /usr/app && chown -R node:node /usr/app
WORKDIR /usr/app

COPY . .
RUN yarn

USER node
ENV NODE_ENV=production
CMD ["npm", "start"]