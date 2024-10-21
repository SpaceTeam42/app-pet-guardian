import styled, { css } from 'styled-components/native';

import { Image } from 'expo-image';

import { RFValue } from 'react-native-responsive-fontsize';

export const DetailNewsContainer = styled.View`
  flex: 1;
`;

export const DetailNewsContent = styled.View`
  padding: ${RFValue(16)}px;
`;

export const Title = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS.BLACK};
  `};
`;

export const WriterText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.MEDIUM};
    font-size: ${RFValue(theme.FONT_SIZE.SM)}px;
    color: ${theme.COLORS.GRAY_500};
  `};

  line-height: 14px;
`;

export const NewsImage = styled(Image)`
  width: 100%;
  height: ${RFValue(170)}px;

  margin: ${RFValue(15)}px 0;

  border-radius: ${RFValue(5)}px;
`;
