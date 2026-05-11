

const getRequiredEnv = (name: string) => {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`${name} is missing in client .env`);
  }

  return value;
};

export const env = {
  SERVER_API: getRequiredEnv("VITE_SERVER_API"),
};
