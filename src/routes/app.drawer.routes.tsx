import { createDrawerNavigator } from '@react-navigation/drawer';

import { useTheme } from 'styled-components/native';

import { CustomDrawer } from '@components/CustomDrawer';

import { AboutScreen } from '@screens/About';
import { AppBottomTab } from './app.tabs.bottom.routes';

const { Navigator, Screen } = createDrawerNavigator();

const AppDrawerRoutes = () => {
  const theme = useTheme();

  return (
    <Navigator
      initialRouteName="homeTabs"
      drawerContent={(props) => <CustomDrawer props={props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerActiveBackgroundColor: theme.COLORS.PINK_200,
        drawerActiveTintColor: theme.COLORS.WHITE,
        drawerInactiveTintColor: theme.COLORS.GRAY_500,
        drawerLabelStyle: {
          fontFamily: theme.FONTS.REGULAR,
        },
      }}
    >
      {/* <Screen
        name="homeTabs"
        component={AppBottomTab}
        options={{
          title: 'Início',
        }}
      /> */}

      <Screen
        name="aboutScreen"
        component={AboutScreen}
        options={{
          title: 'Sobre',
        }}
      />
    </Navigator>
  );
};

export { AppDrawerRoutes };
