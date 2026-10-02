"use client";

import { App } from "./App";
import { productionDeps } from "./productionDeps";

export function ProductionApp() {
  return <App deps={productionDeps} />;
}
