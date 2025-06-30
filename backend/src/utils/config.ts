import { config as dotEnvConfig } from 'dotenv';

export type Config = {
  port: number;
  env: string;
};

const config: Config = loadConfig();

export function loadConfig(): Config {
  dotEnvConfig();

  console.log('Configuration loaded from .env file');

  const env = process.env.NODE_ENV || 'development';
  const port = parseInt(process.env.PORT || '3000', 10);

  return {
    env,
    port,
  };
}

export function getConfigValue<T extends keyof Config>(key: T): Config[T] {
  return config[key];
}
