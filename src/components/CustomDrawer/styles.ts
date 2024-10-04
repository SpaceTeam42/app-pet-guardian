import styled, { css } from 'styled-components/native';

import { TouchableOpacity } from 'react-native';

import { Image } from 'expo-image';

import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  /* height: ${RFValue(100)}px; */

  padding: ${RFValue(20)}px;
`;

export const BoxProfile = styled.View``;

export const ProfilePhoto = styled(Image)`
  width: ${RFValue(100)}px;
  height: ${RFValue(100)}px;

  border-radius: ${RFValue(50)}px;

  margin-bottom: ${RFValue(10)}px;
`;

export const BoxProfileWithoutPhoto = styled.View`
  width: ${RFValue(100)}px;
  height: ${RFValue(100)}px;

  align-items: center;
  justify-content: center;

  border-radius: ${RFValue(50)}px;

  margin-bottom: ${RFValue(10)}px;

  background-color: ${({ theme }) => theme.COLORS.GRAY_200};
`;

export const ProfileName = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS.WHITE};
  `};

  /* font-family: ${({ theme }) => theme.FONTS.REGULAR};
  font-size: ${RFValue(22)}px;
  color: ${({ theme }) => theme.COLORS.WHITE}; */
`;

export const ProfileEmail = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${theme.FONT_SIZE.SM}px;
    color: ${({ theme }) => theme.COLORS.WHITE};
  `}
  /* font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.COLORS.WHITE}; */
  line-height: ${RFValue(15)}px;
`;

export const SignInButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})``;

export const SignInButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.BOLD};
    font-size: ${theme.FONT_SIZE.LG}px;
    color: ${theme.COLORS.WHITE};
  `}
  /* font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${RFValue(22)}px;
  color: ${({ theme }) => theme.colors['white-color']}; */
  text-decoration: underline;
`;

export const Content = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.WHITE};

  padding-top: ${RFValue(10)}px;
`;

export const Footer = styled.View`
  width: 100%;
  height: ${RFValue(60)}px;

  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.COLORS.GRAY_100};

  padding: ${RFValue(10)}px;
`;

export const ExitButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const ExitButtonText = styled.Text`
  font-family: ${({ theme }) => theme.FONTS.MEDIUM};
  font-size: ${RFValue(17)}px;

  margin-left: ${RFValue(10)}px;
`;
