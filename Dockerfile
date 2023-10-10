FROM node:14.14.0-alpine as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY ./ ./

FROM httpd:2.4
COPY --from=builder /app /usr/local/apache2/
RUN apt update
RUN apt install -y nodejs
CMD ["node", "app.js"]