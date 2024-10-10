import styled from 'styled-components/native';

import { TouchableOpacity } from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { Image } from 'expo-image';
import { css } from 'styled-components';

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

  background-color: red;

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
`;

export const Title = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.LG)}px;
    color: ${theme.COLORS.BLACK};
  `};
`;

export const Text = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS.BLACK};
  `};

  margin-top: ${RFValue(10)}px;
`;

export const BoxNameGenderLocation = styled.View`
  flex: 1;
  flex-direction: column;

  margin-top: ${RFValue(20)}px;
  margin-right: ${RFValue(10)}px;
`;

export const PetName = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.MEDIUM};
    font-size: ${RFValue(theme.FONT_SIZE.XL)}px;
    color: ${theme.COLORS.BLACK};
  `};

  /* font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(22)}px;
  color: ${({ theme }) => theme.colors['black-color']}; */
`;

export const PetGender = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.MD)}px;
    color: ${theme.COLORS.BLACK};
  `};

  margin-top: ${RFValue(-7)}px;
`;

export const PetLocation = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONTS.REGULAR};
    font-size: ${RFValue(theme.FONT_SIZE.SM)}px;
    color: ${theme.COLORS.GRAY_500};
  `};
`;

export const BoxTutor = styled.View`
  margin-top: ${RFValue(30)}px;
`;

export const BoxTutorInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const TutorInfo = styled.View`
  height: ${RFValue(60)}px;

  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const TutorName = styled.Text`
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
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;

  align-items: center;
  justify-content: center;

  background-color: ${({ color }) => color};

  padding: ${RFValue(8)}px;

  margin-left: ${RFValue(15)}px;

  border-radius: ${RFValue(30)}px;
`;

export const BoxLastSeen = styled.View`
  margin-top: ${RFValue(25)}px;
`;

export const BoxDescription = styled.View`
  margin: ${RFValue(25)}px 0;
`;
