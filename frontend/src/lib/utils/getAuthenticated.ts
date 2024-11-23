import getSessionIdFromCookies from './getSessionIdFromCookies.ts';
import parseJSONWebToken from './parseJWT.ts';

export default function getAuthenticated(cookies: string) {
  const authorization = getSessionIdFromCookies(cookies);
  if (!authorization) {
    return;
  }

  const claims = parseJSONWebToken(authorization);
  const userId = claims?.id;
  const now = Date.now() / 1000;
  if (!(userId && now <= claims.exp)) {
    return;
  }

  return {
    claims,
    authorization,
  };
}
