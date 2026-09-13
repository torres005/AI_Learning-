import "dotenv/config";

function getEnv(name: string, fallback: string = ""): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : fallback;
}

export const env = {
  appId: getEnv("APP_ID", "smart-learning-adventure"),
  appSecret: getEnv("APP_SECRET", "smart-learning-adventure-secret-key-2026"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: getEnv("DATABASE_URL", ""),
  kimiAuthUrl: getEnv("KIMI_AUTH_URL", "https://api.kimi.com"),
  kimiOpenUrl: getEnv("KIMI_OPEN_URL", "https://open.kimi.com"),
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
};
