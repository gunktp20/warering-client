# TODO: build production
FROM node:21-alpine3.18
WORKDIR /usr/src/app

COPY . .

RUN npm install 
RUN npm run build 
EXPOSE 3000

CMD [ "npm","run","preview" ]