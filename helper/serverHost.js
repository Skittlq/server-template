import "dotenv/config";
import isDev from "./isDev";
import env from "./envResolver";

const host = () => {
  const isProd = !isDev();
  const domain = isProd ? env("PROD_SERVER_DOMAIN") : env("DEV_SERVER_DOMAIN");
  const port = isProd ? env("PROD_SERVER_PORT") : env("DEV_SERVER_PORT");
  const path = isProd ? env("PROD_SERVER_PATH") : env("DEV_SERVER_PATH");

  let url = `https://${domain}`;
  if (port) url += `:${port}`;
  if (path) url += `/${path}`;
  return url;
};

export default host;
