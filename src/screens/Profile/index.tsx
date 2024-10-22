import { useCallback } from 'react';

import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@hooks/auth';

import { Header } from '@components/Header';

import {
  ImageProfile,
  InfoProfile,
  NameProfile,
  OptionButton,
  OptionButtonText,
  OptionsContainer,
  ProfileContainer,
  ProfileContent,
} from './styles';

enum ROUTES {
  EDIT_PROFILE = 'editProfileScreen',
  EDIT_PASSWORD = 'editPasswordScreen',
  REMOVE_ACCOUNT = 'removeAccountScreen',
  HOME = 'homeScreen',
}

// const ROUTES = 'EditProfileScreen' || 'EditPasswordScreen';

type ROUTES_NAVIGATION = keyof typeof ROUTES;

const ProfileScreen = () => {
  const { signOut, tutor } = useAuth();
  const navigation = useNavigation();

  // FUNCTIONS
  const handleNavigation = useCallback(
    (route: ROUTES_NAVIGATION) => {
      navigation.navigate(ROUTES[route]);
    },
    [navigation],
  );

  const handleSignOut = useCallback(() => {
    signOut();

    navigation.navigate(ROUTES.HOME);
  }, [signOut, navigation]);
  // END FUNCTIONS

  return (
    <ProfileContainer>
      <Header title="Perfil" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileContent>
          <InfoProfile>
            {tutor && (
              <>
                <ImageProfile source={{ uri: tutor.avatar_url }} />

                <NameProfile>{tutor.name.substring(0, 200)}</NameProfile>
              </>
            )}
          </InfoProfile>

          <OptionsContainer>
            <OptionButton
              onPress={() => {
                handleNavigation('EDIT_PROFILE');
              }}
            >
              <OptionButtonText>Atualizar perfil</OptionButtonText>
            </OptionButton>

            <OptionButton
              onPress={() => {
                handleNavigation('EDIT_PASSWORD');
              }}
            >
              <OptionButtonText>Atualizar senha</OptionButtonText>
            </OptionButton>

            <OptionButton
              onPress={() => {
                handleNavigation('REMOVE_ACCOUNT');
              }}
            >
              <OptionButtonText>Remover conta</OptionButtonText>
            </OptionButton>

            <OptionButton onPress={handleSignOut}>
              <OptionButtonText>Sair</OptionButtonText>
            </OptionButton>
          </OptionsContainer>
        </ProfileContent>
      </ScrollView>
    </ProfileContainer>
  );
};

export { ProfileScreen };
