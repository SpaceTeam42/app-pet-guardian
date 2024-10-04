import styled, { css } from 'styled-components/native';

import { TouchableOpacity } from 'react-native-gesture-handler';

import { RFValue } from 'react-native-responsive-fontsize';

import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  width: 100%;
  /* height: ${RFValue(100)}px; */

  flex-direction: row;
  align-items: center;

  /* margin-top: ${RFValue(getStatusBarHeight())}px; */

  padding: ${RFValue(30)}px ${RFValue(16)}px ${RFValue(10)}px ${RFValue(16)}px;

  background-color: ${({ theme }) => theme.COLORS.WHITE};

  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.COLORS.GRAY_100};
`;

export const HeaderBackButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})``;

export const HeaderTitle = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${theme.FONT_SIZE.MD}px;
    color: ${theme.COLORS.BLACK};
  `}
  /* font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(17)}px;
  color: ${({ theme }) => theme.colors['black-color']}; */
  line-height: ${RFValue(25)}px;

  margin-left: ${RFValue(5)}px;
`;
