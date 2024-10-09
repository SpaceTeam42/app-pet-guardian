import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { RFValue } from 'react-native-responsive-fontsize';

import { useTheme } from 'styled-components/native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { HomeScreen } from '@screens/Home';
import { NewsScreen } from '@screens/News';
import { LookingForPetsScreen } from '@screens/LookingForPets';
import { FavoritesScreen } from '@screens/Favorites';

const { Navigator, Screen } = createBottomTabNavigator();

const AppBottomTab = () => {
  const theme = useTheme();

  return (
    <Navigator
      initialRouteName="HomeScreen"
      backBehavior="history"
      screenOptions={{
        tabBarActiveTintColor: theme.COLORS.PINK_200,
        tabBarInactiveTintColor: theme.COLORS.GRAY_200,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 50,
        },
        tabBarLabelStyle: {
          fontSize: RFValue(15),
        },
      }}
    >
      <Screen
        name="homeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="paw"
              size={RFValue(30)}
              color={color}
            />
          ),
        }}
      />

      <Screen
        name="newsScreen"
        component={NewsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="newspaper-variant"
              size={RFValue(30)}
              color={color}
            />
          ),
        }}
      />

      <Screen
        name="lookingForPetsScreen"
        component={LookingForPetsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="magnify-expand"
              size={RFValue(30)}
              color={color}
            />
          ),
        }}
      />

      <Screen
        name="favoritesScreen"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="heart"
              size={RFValue(30)}
              color={color}
            />
          ),
        }}
      />
    </Navigator>
  );
};

export { AppBottomTab };
