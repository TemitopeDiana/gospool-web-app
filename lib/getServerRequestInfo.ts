import { cookies } from 'next/headers';

export const getServerRequestInfo = async () => {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('access_token');
  const refresh_token = cookieStore.get('refresh_token');

  return {
    access_token,
    refresh_token,
  };
};
