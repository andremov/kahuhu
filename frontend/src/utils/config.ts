export type Config = {
  apiAddress: string;
};

const config: Config = loadConfig();

export function loadConfig(): Config {
  console.log('Configuration loaded from .env file');

  const apiAddress = import.meta.env.VITE_API_ADDRESS || 'localhost:3001';

  return { apiAddress };
}

export function getConfigValue<T extends keyof Config>(key: T): Config[T] {
  return config[key];
}
