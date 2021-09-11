FROM denoland/deno:1.13.2

EXPOSE 7575

WORKDIR /app

COPY deps.ts .
RUN deno cache --unstable deps.ts

# ADD . .
# RUN deno cache --unstable server.ts

RUN mkdir /_data
