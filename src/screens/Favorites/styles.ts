import styled, { css } from 'styled-components/native';

import { TouchableOpacity, FlatList } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import { RFValue } from 'react-native-responsive-fontsize';

import { Image } from 'expo-image';

interface IReloadButtonProps {
  loading: boolean;
}

interface IPetListProps {
  id: string;
  name_pet: string;
  gender: string;
  gender_formatted: string;
  city: string;
  state: string;
  avatar_url: string;
}

export const Container = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.GRAY_100};
`;

export const Content = styled.View`
  flex: 1;

  padding: 0 ${RFValue(16)}px;

  margin-top: ${RFValue(20)}px;
`;

export const Title = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.MEDIUM};
    font-size: ${RFValue(theme.FONT_SIZE.XL)}px;
    color: ${({ theme }) => theme.COLORS.BLACK};
  `}
`;

export const BoxPetsContent = styled.View`
  flex: 1;
`;

export const BoxNoContent = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const NoContentText = styled.Text`
  width: 100%;

  ${({ theme }) => css`
    font-family: ${theme.FONTS.MEDIUM};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${({ theme }) => theme.COLORS.BROWN_500};
  `};

  text-align: center;
`;

export const ReloadButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})<IReloadButtonProps>`
  width: ${RFValue(150)}px;

  background-color: ${({ theme }) => theme.COLORS.PINK_200};

  align-items: center;
  justify-content: center;

  margin-top: ${RFValue(10)}px;

  padding: ${RFValue(5)}px;

  border-radius: ${RFValue(5)}px;

  ${({ loading }) =>
    loading &&
    css`
      opacity: 0.5;
    `}
`;

export const ReloadButtonText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.MEDIUM};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${({ theme }) => theme.COLORS.WHITE};
  `};

  text-transform: uppercase;
`;

export const PetsList = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
})<IPetListProps>`
  margin-top: ${RFValue(20)}px;
` as unknown as typeof FlatList;

export const BoxPet = styled(RectButton)`
  background-color: ${({ theme }) => theme.COLORS.WHITE};

  flex-direction: row;
  align-items: center;

  margin-bottom: ${RFValue(10)}px;

  padding: ${RFValue(10)}px;

  border-radius: ${RFValue(10)}px;
`;

export const PetPhoto = styled(Image)`
  width: ${RFValue(120)}px;
  height: ${RFValue(90)}px;

  border-radius: ${RFValue(7)}px;
`;

export const PetInformation = styled.View`
  height: 100%;

  flex: 1;

  padding: 0 ${RFValue(8)}px;

  margin: 0 ${RFValue(5)}px;
`;

export const PetName = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
  `};
`;

export const PetLocation = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.SM)}px;
  `};
`;

export const PetGender = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.SM)}px;
  `};
`;

export const PetArrow = styled.View``;
