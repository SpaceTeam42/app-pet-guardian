import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';

import { ITutor } from 'src/dtos/tutor-dto';

import { api } from '@libs/api';

import { tutorGet, tutorRemove, tutorAdd } from '@storage/storage-tutor';

import {
  authTokenGet,
  authTokenRemove,
  authTokenAdd,
} from '@storage/storage-auth-token';

interface IAuthState {
  tutor: ITutor;
  token: string;
  refresh_token: string;
}

interface ICredentials {
  email: string;
  password: string;
}

interface IAuthContextDataProps {
  tutor: ITutor;
  isLoadingStorageData: boolean;
  signIn({ email, password }: ICredentials): Promise<void>;
  signOut(): Promise<void>;
  updateTutor(tutor: ITutor): Promise<void>;
}

interface IAuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContextDataProps>(
  {} as IAuthContextDataProps,
);

const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [tutor, setTutor] = useState<ITutor>({} as ITutor);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);

  // FUNCTIONS
  const userAndTokenUpdate = useCallback(
    async (tutorData: ITutor, token: string) => {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      setTutor(tutorData);
    },
    [],
  );

  const storageUserAndTokenSave = useCallback(
    async (tutorData: ITutor, token: string, refresh_token: string) => {
      try {
        setIsLoadingUserStorageData(true);

        await tutorAdd(tutorData);
        await authTokenAdd({ token, refresh_token });
      } catch (error) {
        throw error;
      } finally {
        setIsLoadingUserStorageData(false);
      }
    },
    [],
  );

  const signIn = useCallback(
    async ({ email, password }: ICredentials) => {
      try {
        const response = await api.post('/authenticate_tutor/session', {
          email,
          password,
        });

        if (response.status === 201) {
          const { tutor, token, refresh_token } = response.data as IAuthState;

          if (tutor.type !== 'TUTOR') {
            throw new Error('Profile invalid!');
          }

          await storageUserAndTokenSave(tutor, token, refresh_token);
          await userAndTokenUpdate(tutor, token);

          api.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        throw error;
      }
    },
    [storageUserAndTokenSave, userAndTokenUpdate],
  );

  const signOut = useCallback(async () => {
    try {
      setIsLoadingUserStorageData(true);

      setTutor({} as ITutor);

      await tutorRemove();
      await authTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }, []);

  const updateTutor = useCallback(async (tutor: ITutor) => {
    setTutor(tutor);

    await tutorAdd(tutor);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoadingUserStorageData(true);

      const tutorLogged = await tutorGet();
      const { token, refresh_token } = await authTokenGet();

      if (tutorLogged && token && refresh_token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        const response = await api.get('/tutors/me');

        if (response.status === 200) {
          const { tutor } = response.data;

          userAndTokenUpdate(tutor, token);
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }, [userAndTokenUpdate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);

    // LIMPEZA DE MEMÓRIA
    return () => {
      subscribe();
    };
  }, [signOut]);

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
        tutor,
        isLoadingStorageData: isLoadingUserStorageData,
        signIn,
        signOut,
        updateTutor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): IAuthContextDataProps {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be use whiting an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
