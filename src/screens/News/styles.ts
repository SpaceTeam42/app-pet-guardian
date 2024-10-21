import styled, { css } from 'styled-components/native';

import { FlatList } from 'react-native';

import { Image } from 'expo-image';

import { RectButton } from 'react-native-gesture-handler';

import { RFValue } from 'react-native-responsive-fontsize';

export const NewsContainer = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.GRAY_200};
`;

export const Title = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.MEDIUM};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS.BLACK};
  `};
`;

export const NewsContent = styled.View`
  flex: 1;
  margin-top: ${RFValue(20)}px;
`;

export const NewsList = styled.FlatList`
  padding: 0 ${RFValue(20)}px;
` as unknown as typeof FlatList;

export const NewsBox = styled(RectButton)`
  width: 100%;

  background-color: ${({ theme }) => theme.COLORS.WHITE};

  flex-direction: row;
  align-items: center;

  padding: ${RFValue(10)}px;

  border-radius: ${RFValue(10)}px;

  margin-bottom: ${RFValue(10)}px;
`;

export const NewsImage = styled(Image)`
  width: ${RFValue(80)}px;
  height: ${RFValue(80)}px;

  border-radius: ${RFValue(7)}px;
`;

export const NewsInfo = styled.View`
  height: 100%;

  flex: 1;

  padding: 0 ${RFValue(8)}px;

  margin: 0 ${RFValue(5)}px;
`;

export const NewsTitle = styled.Text`
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

  line-height: 17px;
`;

export const NewsText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS.GRAY_500};
  `};

  margin-top: ${RFValue(5)}px;
`;
