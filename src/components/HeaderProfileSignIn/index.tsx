import { useCallback } from 'react';

import { useNavigation, DrawerActions } from '@react-navigation/native';

import { noImage } from '@utils/no-image';

import { useAuth } from '@hooks/auth';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import {
  Content,
  DrawerButton,
  ProfileButton,
  ProfileImage,
  ProfileWithoutUserBoxAvatar,
} from './styles';

export function HeaderProfileSignIn() {
  const { tutor } = useAuth();

  const navigation = useNavigation();
  const theme = useTheme();

  // FUNCTIONS
  const handleOpenDrawer = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleNavigationToSignInOrProfile = useCallback(() => {
    if (tutor) {
      navigation.navigate('profileScreen');
    } else {
      navigation.navigate('signInScreen');
    }
  }, [navigation, tutor]);
  // END FUNCTIONS

  return (
    <Content>
      <DrawerButton onPress={handleOpenDrawer}>
        <Feather name="menu" size={25} color={theme.COLORS.BLACK} />
      </DrawerButton>

      <ProfileButton onPress={handleNavigationToSignInOrProfile}>
        {tutor ? (
          <ProfileImage
            source={{
              uri: tutor.avatar_url ? tutor.avatar_url : noImage(tutor.name),
            }}
            contentFit="cover"
          />
        ) : (
          <ProfileWithoutUserBoxAvatar>
            <Feather name="user" size={25} color={theme.COLORS.GRAY_500} />
          </ProfileWithoutUserBoxAvatar>
        )}
      </ProfileButton>
    </Content>
  );
}
