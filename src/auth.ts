import { AxiosInstance } from "axios";

import { createClient } from "./client";

import { AccessToken, Config, UserConfig } from "./common";

export type TokenRefresher = () => Promise<string>;

export type Authorizer = (
  config: Config,
  client?: AxiosInstance
) => Promise<AccessToken>;

interface OAuthCredentials {
  accessToken: string;
  expires: number;
}

export function createTokenRefresher(
  authorize: Authorizer,
  config: Config
): TokenRefresher {
  let credentials: OAuthCredentials;
  return () => {
    if (isExpired(credentials)) {
      return authorize(config)
        .then((accessToken: AccessToken) => {
          const { access_token, expires_in }: AccessToken = accessToken;
          const expires: number = Date.now() + expires_in * 1000 - 60000;
          return {
            accessToken: access_token,
            expires
          };
        })
        .then(freshCredentials => {
          credentials = freshCredentials;
          return credentials.accessToken;
        });
    }

    return Promise.resolve(credentials.accessToken);
  };
}

export const authorizeCollections: Authorizer = function(
  config: Config,
  client: AxiosInstance = createClient(config)
): Promise<AccessToken> {
  const basicAuthToken: string = createBasicAuthToken(config);
  return client
    .post<AccessToken>("/collection/token/", null, {
      headers: {
        Authorization: `Basic ${basicAuthToken}`
      }
    })
    .then(response => response.data);
};

export const authorizeDisbursements: Authorizer = function(
  config: Config,
  client: AxiosInstance = createClient(config)
): Promise<AccessToken> {
  const basicAuthToken: string = createBasicAuthToken(config);
  return client
    .post<AccessToken>("/disbursement/token/", null, {
      headers: {
        Authorization: `Basic ${basicAuthToken}`
      }
    })
    .then(response => response.data);
};

export function createBasicAuthToken(config: UserConfig): string {
  return Buffer.from(`${config.userId}:${config.userSecret}`).toString(
    "base64"
  );
}

function isExpired(credentials: OAuthCredentials): boolean {
  if (!credentials || !credentials.expires) {
    return true;
  }

  return Date.now() > credentials.expires;
}
