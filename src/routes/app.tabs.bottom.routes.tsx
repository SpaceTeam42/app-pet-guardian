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
      initialRouteName="homeScreen"
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
          tabBarIcon: () => (
            <MaterialCommunityIcons name="paw" size={RFValue(30)} />
          ),
        }}
      />

      <Screen
        name="newsScreen"
        component={NewsScreen}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="newspaper-variant"
              size={RFValue(30)}
            />
          ),
        }}
      />

      <Screen
        name="lookingForPetsScreen"
        component={LookingForPetsScreen}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons name="magnify-expand" size={RFValue(30)} />
          ),
        }}
      />

      <Screen
        name="favoritesScreen"
        component={FavoritesScreen}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons name="heart" size={RFValue(30)} />
          ),
        }}
      />
    </Navigator>
  );
};

export { AppBottomTab };
