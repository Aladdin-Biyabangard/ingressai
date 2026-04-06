FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ARG VITE_BASE_URL
ARG VITE_COURSE_MS_URL

ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_COURSE_MS_URL=$VITE_COURSE_MS_URL

RUN npm run build

FROM nginx:alpine
COPY nginx.docker.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
