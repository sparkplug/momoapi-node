export * from "./collections";
export * from "./users";
export { default as Users } from "./users";
export { default as Collections } from "./collections";

export interface Config {
  callbackHost?: string;
  baseUrl?: string;
  environment?: "sandbox" | "production";
  userSecret: string;
  subscriptionKey: string;
  userId: string;
}
