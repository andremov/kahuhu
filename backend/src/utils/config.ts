import { config as dotEnvConfig } from "dotenv";

export type Config = {
  port: number;
  mongoURI: string;
  env: string;
};

const config: Config = loadConfig();

export function loadConfig(): Config {
  dotEnvConfig();

  console.log("Configuration loaded from .env file");

  const env = process.env.NODE_ENV || "development";
  const port = parseInt(process.env.PORT || "3000", 10);
  const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/local";

  return {
    env,
    port,
    mongoURI,
  };
}

export function getConfigValue<T extends keyof Config>(key: T): Config[T] {
  return config[key];
}
