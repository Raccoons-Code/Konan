FROM node:18

WORKDIR /app

COPY . .
RUN yarn

USER node
ENV NODE_ENV=production
CMD ["npm", "start"]