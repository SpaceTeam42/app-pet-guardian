import styled from 'styled-components/native';

import { Dimensions, FlatList } from 'react-native';

import { Image } from 'expo-image';

import { RFValue } from 'react-native-responsive-fontsize';

interface IImage {
  id: string;
  photo: string;
}

export const ImageSliderContainer = styled.View`
  width: 100%;
`;

export const PetImageWrapper = styled.View`
  width: ${Dimensions.get('window').width}px;
  height: 100%;

  align-items: center;
  justify-content: center;
`;

export const PetImagesList =
  styled.FlatList<IImage>`` as unknown as typeof FlatList;

export const PetImage = styled(Image)`
  width: 100%;
  height: 100%;

  border-bottom-left-radius: ${RFValue(40)}px;
  border-bottom-right-radius: ${RFValue(40)}px;
`;

export const ImageSliderIndexes = styled.View`
  flex-direction: row;
  align-self: center;

  padding-right: ${RFValue(24)}px;

  margin-top: ${RFValue(10)}px;
`;
