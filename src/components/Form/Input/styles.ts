import styled, { css } from 'styled-components/native';

import { View, TextInput, TouchableOpacity } from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

import { Feather } from '@expo/vector-icons';

interface IContentProps {
  isFocused: boolean;
  isError: boolean;
}

export const InputContainer = styled.View`
  width: 100%;
`;

export const InputLabel = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS.BLACK};
  `};
  /* font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(15)}px;
  color: ${({ theme }) => theme.colors['black-color']}; */
`;

export const InputContent = styled(View)<IContentProps>`
  width: 100%;
  height: ${RFValue(50)}px;

  flex-direction: row;
  align-items: center;

  padding: 0 ${RFValue(16)}px;

  background: ${({ theme }) => theme.COLORS.WHITE};

  border-radius: ${RFValue(10)}px;
  border-width: ${RFValue(2)}px;
  border-color: ${({ theme }) => theme.COLORS.GRAY_200};

  margin-bottom: ${RFValue(8)}px;

  ${({ isError, theme }) =>
    isError &&
    css`
      border-color: ${theme.COLORS.RED_200};
    `}

  ${({ isFocused, theme }) =>
    isFocused &&
    css`
      border-color: ${theme.COLORS['primary-color']};
    `}
`;

export const Icon = styled(Feather)``;

export const TextInputField = styled(TextInput)`
  height: ${RFValue(50)}px;

  flex: 1;

  font-size: ${RFValue(16)}px;
  font-family: ${({ theme }) => theme.FONTS.REGULAR};
`;

export const SecureButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  margin-left: ${RFValue(16)}px;
`;

export const IconSecure = styled(Feather)``;