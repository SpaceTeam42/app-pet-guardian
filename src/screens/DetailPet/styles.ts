import styled from 'styled-components/native';

import { View, TouchableOpacity } from 'react-native';
import {
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-x-helper';

import { Image } from 'expo-image';

import { RFValue } from 'react-native-responsive-fontsize';
import { css } from 'styled-components';

interface IShortInformationViewProps {
  color: string;
}

interface IContactButtonProps {
  color: string;
}

export const Container = styled.View`
  flex: 1;
`;

export const Content = styled.View``;

export const BoxPhotoPet = styled.View`
  width: 100%;
  height: ${RFValue(400)}px;

  position: relative;
`;

export const PhotoPet = styled(Image)`
  width: 100%;
  height: 100%;

  border-bottom-left-radius: ${RFValue(40)}px;
  border-bottom-right-radius: ${RFValue(40)}px;
`;

export const BackButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.5,
})`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;

  position: absolute;

  top: ${RFValue(getStatusBarHeight())}px;
  left: 30px;

  z-index: 10;

  justify-content: center;
  align-items: center;

  border-radius: 5px;

  background-color: ${({ theme }) => theme.COLORS.WHITE};
  opacity: 0.5;
`;

export const BoxInformation = styled.View`
  /* height: 100px; */

  padding: 0 ${RFValue(16)}px;

  /* background-color: aquamarine; */

  margin-top: ${RFValue(10)}px;
`;

export const BoxNameFavorite = styled.View`
  flex-direction: row;
  justify-content: space-between;

  margin-top: ${RFValue(20)}px;
`;

export const BoxNameLocation = styled.View`
  flex: 1;
  flex-direction: column;

  margin-right: ${RFValue(10)}px;
`;

export const PetName = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.MEDIUM};
    color: ${theme.COLORS.BLACK};
  `};

  font-size: ${RFValue(22)}px;
`;

export const PetLocation = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.SM)}px;
    color: ${theme.COLORS.GRAY_500};
  `};
`;

export const FavoriteButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})``;

export const BoxFavorite = styled.View`
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;

  align-items: center;
  justify-content: center;
`;

export const BoxShortInformation = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-top: ${RFValue(20)}px;
`;

export const ShortInformationView = styled(View)<IShortInformationViewProps>`
  width: ${RFValue(100)}px;
  height: ${RFValue(80)}px;

  align-items: center;
  justify-content: center;

  border-radius: ${RFValue(20)}px;

  background-color: ${({ color }) => color};
`;

export const ShortInformationText = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.BOLD};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS.WHITE};
  `};
`;

export const BoxTutor = styled.View`
  flex-direction: row;
  align-items: center;

  margin-top: ${RFValue(35)}px;
`;

export const TutorInfo = styled.View`
  /* height: ${RFValue(60)}px; */

  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const TutorPhoto = styled(Image)`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;

  border-radius: ${RFValue(25)}px;

  margin-right: ${RFValue(10)}px;
`;

export const TutorName = styled.Text`
  flex: 1;

  ${({ theme }) => css`
    font-family: ${theme.FONTS.MEDIUM};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS.BLACK};
  `};
`;

export const TutorContact = styled.View`
  height: ${RFValue(60)}px;

  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const ContactButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})<IContactButtonProps>`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;

  align-items: center;
  justify-content: center;

  background-color: ${({ color }) => color};

  padding: ${RFValue(8)}px;

  margin-left: ${RFValue(15)}px;

  border-radius: ${RFValue(20)}px;
`;

export const Title = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.MEDIUM};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS.BLACK};
  `};

  margin-top: ${RFValue(20)}px;
`;

export const Description = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS.BLACK};
  `};

  text-align: justify;

  margin: ${RFValue(10)}px 0;
`;

export const BoxAdoption = styled(View)`
  height: ${RFValue(90)}px;

  align-items: center;
  justify-content: center;

  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.COLORS.GRAY_200};

  padding-bottom: ${getBottomSpace()}px;

  padding-left: ${RFValue(15)}px;
  padding-right: ${RFValue(15)}px;
`;
