import styled from 'styled-components/native';

import { TouchableOpacity } from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

export const Button = styled(TouchableOpacity)`
  height: ${RFValue(56)}px;

  flex-direction: row;
  align-items: center;

  background-color: ${({ theme }) => theme.COLORS.GRAY_100};

  border-radius: ${RFValue(5)}px;

  margin-bottom: ${RFValue(16)}px;
`;

export const ImageContainer = styled.View`
  height: 100%;

  align-items: center;
  justify-content: center;

  padding: ${RFValue(16)}px;

  border-color: ${({ theme }) => theme.COLORS.GRAY_500};
  border-right-width: 1px;
`;

export const Text = styled.Text`
  flex: 1;

  font-family: ${({ theme }) => theme.FONTS.MEDIUM};
  font-size: ${({ theme }) => RFValue(theme.FONT_SIZE.MD)}px;
  text-align: center;

  margin-top: ${RFValue(8)}px;
`;
