import { AxiosInstance } from "axios";
import moment from "moment";

import { createClient } from "./client";

import { AccessToken, Config, UserConfig } from "./common";

export type TokenRefresher = () => Promise<string>;

export type Authorizer = (
  config: Config,
  client?: AxiosInstance
) => Promise<AccessToken>;

interface OAuthCredentials {
  accessToken: string;
  expires: Date;
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
          return {
            accessToken: access_token,
            expires: moment()
              .add(expires_in, "seconds")
              .toDate()
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

  return moment().isAfter(credentials.expires);
}
