import env from "@/helper/envResolver";

function isDev() {
  return env("NODE_ENV") === "development";
}
export default isDev;
