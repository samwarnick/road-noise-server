import { Application, Router } from "./deps.ts";

const app = new Application();

const router = new Router();

app.start({ port: 7575 });
