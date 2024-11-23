export default function getSessionIdFromCookies(cookies) {
    const sessionId = cookies.get('sid');
    return sessionId ?? '';
  };