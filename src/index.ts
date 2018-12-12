export * from "./collections";
export * from "./users";
export { default as Users } from "./users";
export { default as Collections } from "./collections";

export interface Config {
  userId: string;
  userSecret: string;
  subscriptionKey: string;
  environment: "sandbox" | "production";
}
