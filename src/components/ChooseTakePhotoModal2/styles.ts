import styled from 'styled-components/native';

import { TouchableOpacity } from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

export const Content = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS['modal-color']};
`;

export const ModalView = styled.View`
  height: ${RFValue(120)}px;

  background-color: ${({ theme }) => theme.COLORS.WHITE};

  margin-top: auto;
`;

export const BoxClose = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  padding: ${RFValue(8)}px;

  margin-right: ${RFValue(5)}px;
  margin-bottom: ${RFValue(7)}px;
`;

export const CloseButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})``;

export const BoxOptionsTakePhoto = styled.View`
  flex-direction: row;

  align-items: center;
  justify-content: space-around;
`;

export const TakePhotoButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})``;

export const Divisor = styled.View`
  width: ${RFValue(2)}px;
  height: ${RFValue(50)}px;

  background-color: ${({ theme }) => theme.COLORS.GRAY_500};
`;
