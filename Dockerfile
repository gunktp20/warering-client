
ARG NODE_VERSION=21.5.0
ARG VITE_EMQX_DOMAIN
ARG VITE_API_DOMAIN
ARG VITE_EMQX_PROTOCAL
ARG VITE_EMQX_HOST


# Set working directory for all build stages.
FROM node:${NODE_VERSION}-alpine as build

ENV VITE_EMQX_DOMAIN  = $VITE_EMQX_DOMAIN
ENV VITE_API_DOMAIN = $VITE_API_DOMAIN
ENV VITE_EMQX_PROTOCAL = $VITE_EMQX_PROTOCAL
ENV VITE_EMQX_HOST = $VITE_EMQX_HOST

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
CMD ["sh","-c", "npm","run","preview" ]

# FROM nginx:alpine

# COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # เปิดพอร์ต 80
# EXPOSE 80

# # เริ่ม nginx
# CMD ["nginx", "-g", "daemon off;"]