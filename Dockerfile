FROM node:16-alpine

WORKDIR /usr/src

COPY index.js .
COPY node_modules ./node_modules
COPY package.json .

EXPOSE 8080
CMD ["npm", "run", "start"]
