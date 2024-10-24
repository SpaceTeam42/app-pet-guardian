import styled, { css } from 'styled-components/native';

import { TouchableOpacity } from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

interface IContainerProps {
  loading: boolean;
}

export const Container = styled(TouchableOpacity)<IContainerProps>`
  width: 100%;
  height: ${RFValue(50)}px;

  background-color: ${({ theme }) => theme.COLORS.PINK_200};

  align-items: center;
  justify-content: center;

  border-radius: ${RFValue(10)}px;

  ${({ loading }) =>
    loading &&
    css`
      opacity: 0.5;
    `}
`;

export const ButtonText = styled.Text`
  font-family: ${({ theme }) => theme.FONTS.REGULAR};
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.COLORS.WHITE};
  text-transform: uppercase;
`;
