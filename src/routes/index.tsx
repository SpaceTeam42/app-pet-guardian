import { NavigationContainer } from '@react-navigation/native';

// import { useAuth } from '@hooks/auth';

import { AppRoutes } from './app.routes';

const Routes = () => {
  // const { loading, tutor } = useAuth();

  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
};

export { Routes };
