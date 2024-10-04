import styled from 'styled-components/native';

import { RFValue } from 'react-native-responsive-fontsize';

interface IContainerProps {
  active: boolean;
}

export const Container = styled.View<IContainerProps>`
  width: ${RFValue(6)}px;
  height: ${RFValue(6)}px;

  background-color: ${({ theme, active }) =>
    active ? theme.COLORS.GRAY_500 : theme.COLORS.GRAY_100};

  margin-left: ${RFValue(8)}px;

  border-radius: ${RFValue(3)}px;
`;
