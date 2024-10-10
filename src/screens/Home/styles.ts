import styled, { css } from 'styled-components/native';

import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import { Image } from 'expo-image';

import { RFValue } from 'react-native-responsive-fontsize';

interface IBoxSearchProps {
  isFocused: boolean;
}

interface ICategory {
  id: string;
  icon_url: string;
}

interface ICategoryButtonProps {
  is_selected: boolean;
}

interface IReloadButtonProps {
  loading: boolean;
}

interface IPetListProps {
  id: string;
  name: string;
  gender: string;
  gender_formatted: string;
  avatar_url: string;
}

export const HomeContainer = styled.View`
  flex: 1;
`;

export const HomeContent = styled.View`
  flex: 1;
`;

export const HomeContentBackground = styled.View`
  flex: 1;

  background-color: ${({ theme }) => theme.COLORS.GRAY_100};

  margin-top: ${RFValue(20)}px;

  border-top-left-radius: ${RFValue(25)}px;
  border-top-right-radius: ${RFValue(25)}px;
`;

export const HomeBoxNoContent = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const HomeNoContentText = styled.Text`
  width: 100%;

  /* margin-top: ${RFValue(5)}px; */

  ${({ theme }) => css`
    font-family: ${theme.FONTS.MEDIUM};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS.BROWN_500};
  `}

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
    color: ${theme.COLORS.WHITE};
  `};

  text-transform: uppercase;
`;

export const BoxSearchContent = styled.View`
  height: ${RFValue(60)}px;

  flex-direction: row;
  align-items: center;

  padding: 0 ${RFValue(16)}px;

  margin-top: ${RFValue(20)}px;
`;

export const BoxSearch = styled(View)<IBoxSearchProps>`
  height: ${RFValue(50)}px;

  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-items: center;

  background-color: ${({ theme }) => theme.COLORS.WHITE};

  border: 2px;
  border-radius: ${RFValue(10)}px;
  border-color: ${({ theme, isFocused }) =>
    isFocused ? theme.COLORS['primary-color'] : theme.COLORS.WHITE};

  /* margin-right: ${RFValue(15)}px; */

  padding: ${RFValue(8)}px;
`;

export const SearchTextInput = styled(TextInput)`
  flex: 1;

  height: ${RFValue(50)}px;

  padding: ${RFValue(8)}px;

  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS.BLACK};
  `};
`;

export const SearchButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  width: 15%;
  height: ${RFValue(50)}px;

  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.COLORS.PINK_200};

  padding: ${RFValue(5)}px;

  border-radius: ${RFValue(7)}px;
`;

export const BoxCategories = styled(View)`
  width: 100%;
  height: ${RFValue(80)}px;

  margin-top: ${RFValue(15)}px;
`;

export const CategoriesList = styled.FlatList.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: { paddingLeft: RFValue(12), alignItems: 'center' },
})<ICategory>`` as unknown as typeof FlatList;

export const CategoryButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})<ICategoryButtonProps>`
  width: ${RFValue(70)}px;
  height: ${RFValue(60)}px;

  justify-content: center;
  align-items: center;

  border-width: 2px;
  border-color: ${({ theme, is_selected }) =>
    is_selected ? theme.COLORS.PINK_200 : theme.COLORS.WHITE};
  border-radius: ${RFValue(10)}px;

  margin: ${RFValue(5)}px;
`;

export const CategoryButtonImage = styled(Image)`
  width: 100%;

  flex: 1;

  border-radius: 10px;

  object-fit: cover;
`;

export const BoxPetsContent = styled.View`
  flex: 1;
`;

export const PetList = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { paddingHorizontal: RFValue(16) },
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
