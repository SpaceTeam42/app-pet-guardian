import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH_TOKEN_STORAGE } from './storage-config';

interface IStorageAuthTokenProps {
  token: string;
  refresh_token: string;
}

export async function authTokenAdd({
  token,
  refresh_token,
}: IStorageAuthTokenProps) {
  await AsyncStorage.setItem(
    AUTH_TOKEN_STORAGE,
    JSON.stringify({ token, refresh_token }),
  );
}

export async function authTokenGet(): Promise<IStorageAuthTokenProps> {
  const response = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE);

  const { token, refresh_token }: IStorageAuthTokenProps = response
    ? JSON.parse(response)
    : {};

  return { token, refresh_token };
}

export async function authTokenRemove(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE);
}
