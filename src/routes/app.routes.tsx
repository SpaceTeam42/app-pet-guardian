import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from 'styled-components/native';

// PET
import { DetailPetScreen } from '@screens/DetailPet';

// ADOPTION
import { AdoptMeScannerScreen } from '@screens/Adoptions/AdoptMeScanner';
import { FinishAdoptMeScreen } from '@screens/Adoptions/FinishAdoption';

import { SignInScreen } from '@screens/SignIn';
import { SignUpScreen } from '@screens/SignUp';

// PROFILE
import { ProfileScreen } from '@screens/Profile';
import { EditProfileScreen } from '@screens/Profile/EditProfile';
import { EditPasswordScreen } from '@screens/Profile/EditPassword';
import { RemoveAccountScreen } from '@screens/Profile/RemoveAccount';

// LOOKING FOR PET
import { DetailLookingForPetScreen } from '@screens/DetailLookingForPet';

// import { AppBottomTab } from './app.tabs.bottom.routes';

// NEWS
import { DetailNewsScreen } from '@screens/News/Datail';

import { AppDrawerRoutes } from './app.drawer.routes';

const { Navigator, Screen } = createNativeStackNavigator();

const AppRoutes = () => {
  const theme = useTheme();

  return (
    <Navigator
      initialRouteName="homeDrawer"
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: theme.COLORS.WHITE,
        },
      }}
    >
      <Screen name="homeDrawer" component={AppDrawerRoutes} />

      <Screen name="detailPetScreen" component={DetailPetScreen} />

      {/* ADOPTION */}
      <Screen name="adoptMeScannerScreen" component={AdoptMeScannerScreen} />

      <Screen name="finishAdoptMeScreen" component={FinishAdoptMeScreen} />
      {/* END ADOPTION */}

      <Screen name="signInScreen" component={SignInScreen} />

      <Screen name="signUpScreen" component={SignUpScreen} />

      {/* PROFILE */}
      <Screen name="profileScreen" component={ProfileScreen} />

      <Screen name="editProfileScreen" component={EditProfileScreen} />

      <Screen name="editPasswordScreen" component={EditPasswordScreen} />

      <Screen name="removeAccountScreen" component={RemoveAccountScreen} />
      {/* END PROFILE */}

      {/* LOOKING FOR PET */}
      <Screen
        name="detailLookingForPetScreen"
        component={DetailLookingForPetScreen}
      />

      {/* NEWS */}
      <Screen name="detailNewsScreen" component={DetailNewsScreen} />
    </Navigator>
  );
};

export { AppRoutes };
