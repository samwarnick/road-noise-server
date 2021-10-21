FROM denoland/deno:1.15.2

EXPOSE 7575

WORKDIR /app

COPY deps.ts .
RUN deno cache --unstable deps.ts

ADD . .
RUN deno cache --unstable server.ts

RUN mkdir /app/_data
