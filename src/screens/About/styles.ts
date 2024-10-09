import styled from 'styled-components/native';

import { RFValue } from 'react-native-responsive-fontsize';

import { Image } from 'expo-image';

export const AboutContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.GRAY_100};
`;

export const AboutContent = styled.View`
  margin-top: ${RFValue(10)}px;

  padding: 0 ${RFValue(20)}px;
`;

export const LogoImage = styled(Image)`
  width: 70%;
`;

export const AboutText = styled.Text`
  font-family: ${({ theme }) => theme.FONTS.REGULAR};
  font-size: ${RFValue(15)}px;
  color: ${({ theme }) => theme.COLORS.BLACK};
  text-align: justify;
`;
