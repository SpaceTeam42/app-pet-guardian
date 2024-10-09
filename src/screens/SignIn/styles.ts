import styled from 'styled-components/native';

import { TouchableOpacity } from 'react-native';

import { Image } from 'expo-image';

import { RFValue } from 'react-native-responsive-fontsize';
import { css } from 'styled-components';

export const Container = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS['background-color']};
`;

export const Content = styled.View`
  flex: 1;

  padding: 0 ${RFValue(16)}px;
`;

export const BoxLogo = styled.View`
  align-items: center;
  justify-content: center;
`;

export const LogoImage = styled(Image)`
  width: ${RFValue(200)}px;
`;

export const SignInTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS.BLACK};
  `};

  text-align: center;

  margin-bottom: ${RFValue(40)}px;
`;

export const BoxOptionsLogin = styled.View`
  padding: 0 ${RFValue(32)}px;
`;

export const BoxForm = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  margin-top: ${RFValue(-30)}px;
`;

export const FormBackButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  width: 100%;

  margin-bottom: ${RFValue(20)}px;
`;

export const DivisorText = styled.Text`
  width: 100%;

  font-family: ${({ theme }) => theme.FONTS.REGULAR};
  font-size: ${({ theme }) => RFValue(theme.FONT_SIZE.MD)}px;
  text-align: center;

  margin-top: ${RFValue(20)}px;
  margin-bottom: ${RFValue(20)}px;
`;

export const BoxCreateAccount = styled.View`
  padding: 0 ${RFValue(32)}px;
`;

export const ForgotPasswordButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  width: 100%;

  align-items: center;

  margin-top: ${RFValue(25)}px;
`;

export const ForgotPasswordButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(17)}px;
`;
