import { useCallback } from 'react';
import { Alert } from 'react-native';

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import { useNavigation, DrawerActions } from '@react-navigation/native';

import { useAuth } from '@hooks/auth';

import { useTheme } from 'styled-components/native';

import { noImage } from '@utils/no-image';

import { Feather } from '@expo/vector-icons';

import {
  Container,
  Header,
  BoxProfile,
  ProfilePhoto,
  BoxProfileWithoutPhoto,
  ProfileName,
  ProfileEmail,
  SignInButton,
  SignInButtonText,
  Content,
  Footer,
  ExitButton,
  ExitButtonText,
} from './styles';

interface ICustomDrawerProps {
  props: DrawerContentComponentProps;
}

const CustomDrawer = ({ props }: ICustomDrawerProps) => {
  const { tutor, signOut } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation();

  // FUNCTION
  const handleSignInNavigation = useCallback(() => {
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.navigate('signInScreen');
  }, [navigation]);

  const handleExitApp = useCallback(() => {
    Alert.alert('Guardião Pet', 'Deseja sair do aplicativo?', [
      {
        text: 'Sim',
        style: 'default',
        onPress: async () => {
          await signOut();
          navigation.dispatch(DrawerActions.closeDrawer());
          // BackHandler.exitApp();
        },
      },
      {
        text: 'Não',
        style: 'cancel',
        onPress: () => null,
      },
    ]);
  }, [signOut, navigation]);
  // END FUNCTION

  return (
    <Container>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          backgroundColor: theme.COLORS['primary-color'],
        }}
      >
        <Header>
          <BoxProfile>
            {tutor ? (
              <>
                <ProfilePhoto
                  source={{
                    uri: tutor.avatar_url
                      ? 'https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
                      : noImage(tutor.name),
                  }}
                  resizeMode="cover"
                />

                <ProfileName>{tutor.name}</ProfileName>
                <ProfileEmail>{tutor.email}</ProfileEmail>
              </>
            ) : (
              <>
                <BoxProfileWithoutPhoto>
                  <Feather name="user" size={50} color={theme.COLORS.WHITE} />
                </BoxProfileWithoutPhoto>

                {/* <ProfilePhoto
                  source={{
                    uri: 'https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
                  }}
                  resizeMode="cover"
                /> */}

                <SignInButton onPress={handleSignInNavigation}>
                  <SignInButtonText>Entrar</SignInButtonText>
                </SignInButton>
              </>
            )}
          </BoxProfile>
        </Header>

        <Content>
          <DrawerItemList {...props} />
        </Content>
      </DrawerContentScrollView>

      {tutor && (
        <Footer>
          <ExitButton onPress={handleExitApp}>
            <Feather name="log-out" size={25} color={theme.COLORS.BLACK} />

            <ExitButtonText>Sair</ExitButtonText>
          </ExitButton>
        </Footer>
      )}
    </Container>
  );
};

export { CustomDrawer };
