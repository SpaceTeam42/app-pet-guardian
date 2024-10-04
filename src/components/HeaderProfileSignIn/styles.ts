import styled from 'styled-components/native';

import {
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export const Content = styled.View`
  height: ${RFValue(55)}px;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 0 ${RFValue(16)}px;

  margin-top: ${getStatusBarHeight()}px;
`;

export const DrawerButton = styled(TouchableWithoutFeedback)``;

export const ProfileButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})``;

export const ProfileImage = styled(Image)`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;

  border-radius: ${RFValue(20)}px;
`;

export const ProfileWithoutUserBoxAvatar = styled.View`
  width: ${RFValue(45)}px;
  height: ${RFValue(45)}px;

  background-color: ${({ theme }) => theme.COLORS.GRAY_200};

  align-items: center;
  justify-content: center;

  border-radius: ${RFValue(22)}px;
`;
