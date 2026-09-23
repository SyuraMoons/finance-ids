import { readFileSync } from "node:fs";
import { parse } from "yaml";

// Lives at backend/openapi.yaml (outside src/, so tsc never has to copy it).
// "../../" resolves there from both src/lib/ (tsx dev) and dist/lib/ (prod).
const specPath = new URL("../../openapi.yaml", import.meta.url);

/** The OpenAPI spec, parsed once at startup. Served by Swagger UI at /api/docs. */
export const openapiSpec: Record<string, unknown> = parse(readFileSync(specPath, "utf8"));
