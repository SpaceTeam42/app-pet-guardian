import styled, { css } from 'styled-components/native';

import { TouchableOpacity } from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

export const EditProfileContainer = styled.View`
  flex: 1;
`;

export const EditProfileContent = styled.View`
  margin-top: ${RFValue(20)}px;

  padding: 0 ${RFValue(16)}px;
`;

export const Label = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.SM)}px;
    color: ${({ theme }) => theme.COLORS.BLACK};
  `}
`;

export const BoxPhoneWhatsApp = styled.View`
  width: 65%;

  flex-direction: row;
  align-items: center;
`;

export const WhatsAppCheckButton = styled(TouchableOpacity).attrs(() => ({
  activeOpacity: 1,
}))`
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

export const BoxState = styled.View``;

export const BoxCity = styled.View`
  margin: ${RFValue(8)}px 0;
`;

export const Footer = styled.View`
  margin: ${RFValue(15)}px 0;
`;
