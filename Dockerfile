
ARG NODE_VERSION=21.5.0
# Set working directory for all build stages.
FROM node:${NODE_VERSION}-alpine as build

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# เปิดพอร์ต 80
EXPOSE 80

# เริ่ม nginx
CMD ["nginx", "-g", "daemon off;"]
