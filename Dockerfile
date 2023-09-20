FROM node:lts

RUN ls /usr
RUN mkdir /usr/app && chown -R node:node /usr/app
WORKDIR /usr/app

COPY . .
RUN yarn
RUN npm run build

USER node
ENV NODE_ENV=production
CMD ["npm", "start"]
