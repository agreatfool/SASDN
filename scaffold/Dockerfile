FROM docker.io/node:8.7.0-alpine

RUN apk update \
&& apk add git \
&& apk add libc6-compat \
&& apk add ca-certificates \
&& apk add openssl

RUN npm config set unsafe-perm true \
&& npm install -g better-npm-run@0.1.0 \
&& npm install -g typescript@2.6.2 \
&& npm install -g grpc-tools@1.6.0 \
&& npm install -g gulp@3.9.1 \
&& npm list -g

RUN mkdir -p /data1/www/app
WORKDIR /data1/www/app
COPY . /data1/www/app
RUN npm install && gulp protoc-copy && tsc && npm test
#ENV NODE_ENV product
ENV DEBUG SASDN:*
EXPOSE 9090
CMD [ "node", "index.js" ]