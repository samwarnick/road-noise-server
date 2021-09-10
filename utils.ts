export async function loadEnv() {
  const dotenv = await Deno.readTextFile(".env");
  for (const line of dotenv.split("\n")) {
    if (line) {
      const [key, value] = line.split(/\=(.+)/);
      Deno.env.set(key, value);
    }
  }
}
