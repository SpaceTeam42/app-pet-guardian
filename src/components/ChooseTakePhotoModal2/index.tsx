import { Modal } from 'react-native';

import { useTheme } from 'styled-components/native';

import { MaterialIcons } from '@expo/vector-icons';

import {
  Content,
  ModalView,
  BoxClose,
  CloseButton,
  BoxOptionsTakePhoto,
  TakePhotoButton,
  Divisor,
} from './styles';

interface IChooseTakePhotoModalProps {
  isOpenModal: boolean;
  onCloseModal: () => void;
  onTakePhotoCamera: () => void;
  onTakePhotoGallery: () => void;
}

const ChooseTakePhotoModal = ({
  isOpenModal,
  onCloseModal,
  onTakePhotoCamera,
  onTakePhotoGallery,
}: IChooseTakePhotoModalProps) => {
  const theme = useTheme();

  return (
    <Modal
      animationType="slide"
      visible={isOpenModal}
      transparent
      onRequestClose={() => {
        onCloseModal();
      }}
    >
      <Content>
        <ModalView>
          <BoxClose>
            <CloseButton
              onPress={() => {
                onCloseModal();
              }}
            >
              <MaterialIcons
                name="close"
                size={25}
                color={theme.COLORS.RED_200}
              />
            </CloseButton>
          </BoxClose>

          <BoxOptionsTakePhoto>
            <TakePhotoButton onPress={onTakePhotoCamera}>
              <MaterialIcons
                name="photo-camera"
                size={50}
                color={theme.COLORS.BLACK}
              />
            </TakePhotoButton>

            <Divisor />

            <TakePhotoButton onPress={onTakePhotoGallery}>
              <MaterialIcons
                name="collections"
                size={50}
                color={theme.COLORS.BLACK}
              />
            </TakePhotoButton>
          </BoxOptionsTakePhoto>
        </ModalView>
      </Content>
    </Modal>
  );
};

export { ChooseTakePhotoModal };
