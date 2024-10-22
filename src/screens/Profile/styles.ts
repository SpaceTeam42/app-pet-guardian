import styled from 'styled-components/native';

import { Image } from 'expo-image';

import { RFValue } from 'react-native-responsive-fontsize';

import { getBottomSpace } from 'react-native-iphone-x-helper';

export const ProfileContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS['background-color']};
`;

export const ProfileContent = styled.View`
  width: '100%';

  padding: 0 ${RFValue(20)}px;

  align-items: center;
  justify-content: center;

  margin-bottom: ${getBottomSpace() + 10}px;
`;

export const InfoProfile = styled.View`
  align-items: center;
  justify-content: center;

  margin-top: ${RFValue(20)}px;
  margin-bottom: ${RFValue(10)}px;
`;

export const ImageProfile = styled(Image)`
  width: ${RFValue(150)}px;
  height: ${RFValue(150)}px;

  border-radius: ${RFValue(75)}px;
`;

export const NameProfile = styled.Text`
  font-family: ${({ theme }) => theme.FONTS.MEDIUM};
  font-size: ${({ theme }) => RFValue(theme.FONT_SIZE.LG)}px;

  margin-top: ${RFValue(15)}px;
`;

export const OptionsContainer = styled.View`
  width: '100%';

  margin-top: ${RFValue(20)}px;
`;

export const OptionButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  height: ${RFValue(50)}px;

  align-items: center;
  justify-content: center;

  margin-bottom: ${RFValue(8)}px;

  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.COLORS.PINK_200};
`;

export const OptionButtonText = styled.Text`
  font-family: ${({ theme }) => theme.FONTS.REGULAR};
  font-size: ${({ theme }) => RFValue(theme.FONT_SIZE.MD)}px;
`;
