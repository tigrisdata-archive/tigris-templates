import { Tigris } from '@tigrisdata/core';
import { loadEnvConfig } from '@next/env';
{{range .Collections}}
import { {{.Name}} } from "../models/tigris/{{.JSON}}";
{{- end}}

// Run the config loader only when not executing within next runtime
if (process.env.NODE_ENV === undefined) {
  if (process.env.APP_ENV === 'development') {
    loadEnvConfig(process.cwd(), true);
  } else if (process.env.APP_ENV === 'production') {
    loadEnvConfig(process.cwd());
  }
}

async function main() {
  // setup client and register schemas
  const tigrisClient = new Tigris({serverUrl: "localhost:8081", projectName: "{{.ProjectName}}", branch: "main"});
  await tigrisClient.registerSchemas([
    {{- range .Collections}}
    {{.Name}},
    {{- end}}
  ]);
}

main().then(() => {
  console.log("Setup complete")
});
