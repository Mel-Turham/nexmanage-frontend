let accessToken: string | null = null;
let refreshTokenPromise: Promise<string> | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined' && !accessToken) {
    accessToken = localStorage.getItem('accessToken');
  }
  return accessToken;
};


const refreshAccessToken = async (): Promise<string> => {
  if (!refreshTokenPromise) {
      refreshTokenPromise = fetch('/api/auth/refresh-token', {
          method: 'POST',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
          },
      })
      .then(async (response) => {
          if (!response.ok) {
              throw new Error('Failed to refresh token');
          }
          const data = await response.json();
          console.log('refresh token', data);
          // Assuming the new token is in data.accessToken
          if (!data.accessToken) {
              throw new Error('No access token in response');
          }
          setAccessToken(data.accessToken);
          return data.accessToken as string;
      })
      .finally(() => {
          refreshTokenPromise = null;
      });
  }
  return refreshTokenPromise;
}
