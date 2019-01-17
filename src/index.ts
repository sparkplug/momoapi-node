export * from "./collections";
export * from "./users";
export { default as Users } from "./users";
export { default as Collections } from "./collections";

export interface Config {
  baseUrl: string;
  environment?: "sandbox" | "production";
  host?: string;
  userSecret: string;
  subscriptionKey: string;
  userId: string;
}
