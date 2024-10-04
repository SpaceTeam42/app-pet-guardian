import { useRef, useState } from 'react';

import { ViewToken } from 'react-native';

import { Bullet } from '@components/Bullet';

import {
  ImageSliderContainer,
  PetImageWrapper,
  PetImagesList,
  PetImage,
  ImageSliderIndexes,
} from './styles';

interface IImage {
  id: string;
  photo: string;
}

interface IImageSliderProps {
  imagesUrl: Array<IImage>;
}

interface IChangeImageProps {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

export function ImageSlider({ imagesUrl }: IImageSliderProps) {
  const [imageIndex, setImageIndex] = useState(0);

  const indexChanged = useRef((info: IChangeImageProps) => {
    const index = info.viewableItems[0].index!;

    setImageIndex(index);
  });

  return (
    <ImageSliderContainer>
      <PetImagesList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={imagesUrl}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetImageWrapper>
            <PetImage source={{ uri: item.photo }} resizeMode="cover" />
          </PetImageWrapper>
        )}
        onViewableItemsChanged={indexChanged.current}
      />

      {imagesUrl && (
        <ImageSliderIndexes>
          {imagesUrl.map((item, index) => (
            <Bullet key={String(item.id)} active={index === imageIndex} />
          ))}
        </ImageSliderIndexes>
      )}
    </ImageSliderContainer>
  );
}
