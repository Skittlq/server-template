// envResolver.js
import dotenv from "dotenv";
dotenv.config();

/**
 * Fetch an environment variable, with optional default, type-casting, and validation.
 *
 * @param {string} key
 * @param {object} [opts]
 * @param {*} [opts.default]     – fallback if undefined
 * @param {boolean} [opts.required=false] – throw if still undefined
 * @param {'string'|'number'|'boolean'|'array'} [opts.type='string']
 * @returns {*}  – cast value
 */
export default function env(
  key,
  { default: defaultValue, required = false, type = "string" } = {}
) {
  // grab raw
  const raw = key === "NODE_ENV" ? process.env.NODE_ENV : process.env[key];
  const val = raw == null ? defaultValue : raw;

  if (required && val == null) {
    throw new Error(`Missing required ENV var: "${key}"`);
  }

  if (val == null) {
    return undefined;
  }

  // cast
  switch (type) {
    case "number": {
      const num = Number(val);
      if (Number.isNaN(num)) {
        throw new Error(`ENV "${key}" expected a number, got "${val}"`);
      }
      return num;
    }
    case "boolean": {
      if (/^(true|1)$/i.test(val)) return true;
      if (/^(false|0)$/i.test(val)) return false;
      throw new Error(`ENV "${key}" expected a boolean, got "${val}"`);
    }
    case "array":
      return String(val)
        .split(",")
        .map((s) => s.trim());
    case "string":
    default:
      return String(val);
  }
}
