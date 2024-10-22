import styled, { css } from 'styled-components/native';

import { RFValue } from 'react-native-responsive-fontsize';

export const RemoveAccountContainer = styled.View`
  flex: 1;
`;

export const RemoveAccountContent = styled.View`
  margin-top: ${RFValue(20)}px;

  padding: 0 ${RFValue(16)}px;
`;

export const RemoveAccountMessage = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS.BLACK};
  `};

  text-align: justify;

  margin-bottom: ${RFValue(20)}px;
`;
