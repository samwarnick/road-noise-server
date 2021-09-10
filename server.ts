import { Application, Router, ensureFile } from "./deps.ts";
import { loadEnv } from "./utils.ts";

await loadEnv();
const TOKEN = Deno.env.get("TOKEN");

const app = new Application();

const router = new Router();
router.get("/", async () => {
  const json = await Deno.readTextFile("_data/data.json");
  return new Response(json, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
});
router.post("/", (request) => {
  const token = request.headers.get("Authorization");
  if (token !== `Bearer ${TOKEN}`) {
    return new Response(null, { status: 401 });
  }
  return new Response();
});

await ensureFile("_data/data.json");

app.use(router);
app.start({ port: 7575 });
