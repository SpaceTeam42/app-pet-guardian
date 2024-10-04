import { AuthProvider } from './auth';
import { PetsFavoriteProvider } from './pet_favorite';

interface IAppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: IAppProviderProps) => {
  return (
    <AuthProvider>
      <PetsFavoriteProvider>{children}</PetsFavoriteProvider>
    </AuthProvider>
  );
};

export { AppProvider };
