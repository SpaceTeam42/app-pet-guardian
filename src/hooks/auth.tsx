import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { api } from '@libs/api';

interface ITutor {
  id: string;
  name: string;
  email: string;
  type: 'TUTOR';
  avatar_url: string;
}

interface IAuthState {
  tutor: ITutor;
  token: string;
  refresh_token: string;
}

interface ICredentials {
  email: string;
  password: string;
}

interface INotification {
  notification_token: string;
}

interface IAuthContextData {
  tutor: ITutor;
  loading: boolean;
  signIn({ email, password }: ICredentials): Promise<void>;
  signOut(): Promise<void>;
  updateTutor(tutor: ITutor): Promise<void>;
  updateToken(): Promise<void>;
  updateNotificationToken({ notification_token }: INotification): Promise<void>;
}

interface IProviderProps {
  children: React.ReactNode;
}

const TUTOR_KEY_LOCALSTORAGE = '@GenerationPet:tutor';
const TOKEN_KEY_LOCALSTORAGE = '@GenerationPet:token';
const REFRESH_TOKEN_KEY_LOCALSTORAGE = '@GenerationPet:refresh_token';
const NOTIFICATION_KEY_LOCALSTORAGE = '@GenerationPet:notification_token';

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

const AuthProvider = ({ children }: IProviderProps) => {
  const [data, setData] = useState<IAuthState>({} as IAuthState);
  const [loading, setLoading] = useState(true);

  const updateNotificationToken = useCallback(
    async ({ notification_token }: INotification) => {
      console.log('update notification', notification_token);
    },
    [],
  );

  const signIn = useCallback(
    async ({ email, password }: ICredentials) => {
      const response = await api.post('/authenticate_tutor/session', {
        email,
        password,
      });

      if (response.status === 201) {
        const { tutor, token, refresh_token } = response.data as IAuthState;

        if (tutor.type !== 'TUTOR') {
          throw new Error('Profile invalid!');
        }

        await AsyncStorage.multiSet([
          [TUTOR_KEY_LOCALSTORAGE, JSON.stringify(tutor)],
          [TOKEN_KEY_LOCALSTORAGE, token],
          [REFRESH_TOKEN_KEY_LOCALSTORAGE, refresh_token],
        ]);

        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        const notification_token = await AsyncStorage.getItem(
          NOTIFICATION_KEY_LOCALSTORAGE,
        );

        if (notification_token) {
          await updateNotificationToken({ notification_token: '' });
        }

        setData({ tutor, token, refresh_token });
      }
    },
    [updateNotificationToken],
  );

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([
      TUTOR_KEY_LOCALSTORAGE,
      TOKEN_KEY_LOCALSTORAGE,
      REFRESH_TOKEN_KEY_LOCALSTORAGE,
    ]);

    setData({} as IAuthState);
  }, []);

  const updateTutor = useCallback(
    async (tutor: ITutor) => {
      await AsyncStorage.setItem(TUTOR_KEY_LOCALSTORAGE, JSON.stringify(tutor));

      setData({
        tutor,
        token: data.token,
        refresh_token: data.refresh_token,
      });
    },
    [data.token, data.refresh_token],
  );

  const updateToken = useCallback(async () => {
    const response = await api.post('/authenticate_tutor/refresh_token', {
      refresh_token: data.refresh_token,
    });

    if (response.status === 201) {
      const { token, refresh_token } = response.data;

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      await AsyncStorage.multiSet([
        [TOKEN_KEY_LOCALSTORAGE, token],
        [REFRESH_TOKEN_KEY_LOCALSTORAGE, refresh_token],
      ]);

      setData({
        tutor: data.tutor,
        token,
        refresh_token,
      });
    }
  }, [data.refresh_token, data.tutor]);

  useEffect(() => {
    async function loadData() {
      try {
        const [token, refresh_token, notification_token] =
          await AsyncStorage.multiGet([
            TOKEN_KEY_LOCALSTORAGE,
            REFRESH_TOKEN_KEY_LOCALSTORAGE,
            NOTIFICATION_KEY_LOCALSTORAGE,
          ]);

        if (token[1] && refresh_token[1]) {
          api.defaults.headers.common.Authorization = `Bearer ${token[1]}`;

          if (notification_token[1]) {
            await updateNotificationToken({ notification_token: '' });
          }

          const response = await api.get('/tutors/me');

          if (response.status === 200) {
            const { tutor } = response.data;

            setData({
              tutor,
              token: token[1],
              refresh_token: refresh_token[1],
            });
          }
        }
      } catch (err) {
        // TODO - review error message
        await signOut();
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [updateNotificationToken, signOut]);

  // useEffect(() => {
  //   async function loadStorageData() {
  //     const [tutor, token, refresh_token, notification_token] =
  //       await AsyncStorage.multiGet([
  //         TUTOR_KEY_LOCALSTORAGE,
  //         TOKEN_KEY_LOCALSTORAGE,
  //         REFRESH_TOKEN_KEY_LOCALSTORAGE,
  //         NOTIFICATION_KEY_LOCALSTORAGE,
  //       ]);

  //     if (tutor[1] && token[1] && refresh_token[1]) {
  //       api.defaults.headers.common.Authorization = `Bearer ${token[1]}`;

  //       const tutorData = JSON.parse(tutor[1]) as ITutor;

  //       if (notification_token[1]) {
  //         await updateNotificationToken({ notification_token: '' });
  //       }

  //       setData({
  //         tutor: tutorData,
  //         token: token[1],
  //         refresh_token: refresh_token[1],
  //       });
  //     }

  //     setLoading(false);
  //   }

  //   loadStorageData();
  // }, [updateNotificationToken]);

  return (
    <AuthContext.Provider
      value={{
        tutor: data.tutor,
        loading,
        signIn,
        signOut,
        updateTutor,
        updateToken,
        updateNotificationToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): IAuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be use whiting an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
