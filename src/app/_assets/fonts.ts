import { readFileSync } from "node:fs";
import { join } from "node:path";

export const inter400 = readFileSync(
  join(process.cwd(), "src/app/_assets/fonts/Inter-400.woff"),
);

export const inter500 = readFileSync(
  join(process.cwd(), "src/app/_assets/fonts/Inter-500.woff"),
);

export const inter600 = readFileSync(
  join(process.cwd(), "src/app/_assets/fonts/Inter-600.woff"),
);
