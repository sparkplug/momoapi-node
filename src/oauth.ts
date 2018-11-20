import moment from "moment";

import { Config } from ".";
import { createBasicClient } from "./client";

export interface AccessToken {
  access_token: string;
  token_type: "string";
  expires_in: 3600;
}

export interface OAuthCredentials {
  accessToken: string;
  expires: Date;
}

export type TokenRefresher = () => Promise<OAuthCredentials>;

export type Authenticator = (config: Config) => Promise<AccessToken>;

export default function getTokenRefresher(
  authenticate: Authenticator,
  config: Config
): TokenRefresher {
  let credentials: OAuthCredentials;
  return () => {
    if (isExpired(credentials)) {
      return authenticate(config)
        .then(getCredentials)
        .then(freshCredentials => {
          credentials = freshCredentials;
          return credentials;
        });
    }

    return Promise.resolve(credentials);
  };
}

export const authorizeCollections: Authenticator = function(
  config: Config
): Promise<AccessToken> {
  const basicAuthToken: string = createBasicAuthToken(config);
  return createBasicClient(config)
    .post<AccessToken>("/colection/token/", null, {
      headers: {
        Authorization: `Basic ${basicAuthToken}`
      }
    })
    .then(response => response.data);
};

export function createBasicAuthToken(config: Config): string {
  return Buffer.from(`${config.userId}:${config.userSecret}`).toString(
    "base64"
  );
}

function isExpired(credentials: OAuthCredentials): boolean {
  if (!credentials || !credentials.expires) {
    return true;
  }

  return moment().isAfter(credentials.expires);
}

function getCredentials(accessToken: AccessToken): OAuthCredentials {
  const { access_token, expires_in } = accessToken;
  return {
    accessToken: access_token,
    expires: moment()
      .add(expires_in, "seconds")
      .toDate()
  };
}
