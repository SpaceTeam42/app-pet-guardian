import styled from 'styled-components/native';

import { RFValue } from 'react-native-responsive-fontsize';

export const LoadingModalContainer = styled.Modal``;

export const LoadingModalContent = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS['modal-color']};
`;

export const ModalView = styled.View`
  margin: ${RFValue(20)}px;

  padding: ${RFValue(35)}px;

  align-items: center;
`;
