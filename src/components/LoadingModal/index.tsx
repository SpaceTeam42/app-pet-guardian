import { ActivityIndicator } from 'react-native';

import { useTheme } from 'styled-components/native';

import {
  LoadingModalContainer,
  LoadingModalContent,
  ModalView,
} from './styles';

interface ILoadingModalProps {
  modalVisible: boolean;
}

export function LoadingModal({ modalVisible }: ILoadingModalProps) {
  const theme = useTheme();

  return (
    <LoadingModalContainer
      animationType="fade"
      visible={modalVisible}
      transparent
      onRequestClose={() => {
        return null;
      }}
    >
      <LoadingModalContent>
        <ModalView>
          <ActivityIndicator
            size="large"
            color={theme.COLORS['primary-color']}
          />
        </ModalView>
      </LoadingModalContent>
    </LoadingModalContainer>
  );
}
