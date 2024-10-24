import styled from 'styled-components/native';

import { TouchableOpacity } from 'react-native';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { RFValue } from 'react-native-responsive-fontsize';

import { Image } from 'expo-image';

export const SignUpContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS['background-color']};
`;

export const SignUpContent = styled.View`
  flex: 1;

  padding: 0 ${RFValue(16)}px;

  margin-top: ${RFValue(30)}px;
`;

export const BoxPhoto = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  margin-bottom: ${RFValue(50)}px;
`;

export const BoxWithoutPhoto = styled.View`
  width: ${RFValue(156)}px;
  height: ${RFValue(156)}px;

  background-color: ${({ theme }) => theme.COLORS.GRAY_200};

  border-radius: ${RFValue(78)}px;

  align-items: center;
  justify-content: center;
`;

export const PhotoButton = styled.View`
  position: relative;
`;

export const PhotoImage = styled(Image)`
  width: ${RFValue(156)}px;
  height: ${RFValue(156)}px;

  border-radius: ${RFValue(78)}px;

  align-self: center;
`;

export const BoxPhotoCameraIconButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.9,
})`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;

  position: absolute;
  top: ${RFValue(115)}px;
  right: 0;
  bottom: ${RFValue(10)}px;

  background: ${({ theme }) => theme.COLORS.PINK_200};

  border-radius: ${RFValue(23)}px;

  align-items: center;
  justify-content: center;
`;

export const BoxPhotoDeleteIconButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.9,
})`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;

  position: absolute;
  top: ${RFValue(115)}px;
  left: 0;
  bottom: ${RFValue(10)}px;

  background: ${({ theme }) => theme.COLORS.PINK_200};

  border-radius: ${RFValue(23)}px;

  align-items: center;
  justify-content: center;
`;

export const BoxPhoneWhatsApp = styled.View`
  width: 65%;

  flex-direction: row;
  align-items: center;
`;

export const WhatsAppCheckButton = styled(TouchableWithoutFeedback)`
  flex-direction: row;
  align-items: center;

  /* margin-top: ${RFValue(10)}px; */
  margin-left: ${RFValue(10)}px;
`;

export const WhatsAppCheckButtonText = styled.Text`
  margin-left: ${RFValue(5)}px;
`;

export const BoxPostalCode = styled.View`
  width: 81.5%;

  flex-direction: row;
  align-items: center;
`;

export const SearchPostalCodeButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  width: 50px;
  height: 40px;

  align-items: center;
  justify-content: center;

  margin-top: ${RFValue(17)}px;
  margin-left: ${RFValue(15)}px;

  background-color: ${({ theme }) => theme.COLORS['primary-color']};
  border-radius: 5px;
`;

export const Label = styled.Text`
  font-family: ${({ theme }) => theme.FONTS.REGULAR};
  font-size: ${RFValue(15)}px;
  color: ${({ theme }) => theme.COLORS.BLACK};
`;

export const BoxState = styled.View``;

export const BoxCity = styled.View`
  margin: ${RFValue(8)}px 0;
`;

export const Footer = styled.View`
  margin: ${RFValue(15)}px 0;
`;
