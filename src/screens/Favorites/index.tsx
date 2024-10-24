import { useState, useCallback } from 'react';

import { ActivityIndicator, RefreshControl } from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { usePetsFavorite } from '@hooks/pet_favorite';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { HeaderProfileSignIn } from '@components/HeaderProfileSignIn';

import {
  Container,
  Content,
  Title,
  BoxPetsContent,
  BoxNoContent,
  NoContentText,
  ReloadButton,
  ReloadButtonText,
  PetsList,
  BoxPet,
  PetPhoto,
  PetInformation,
  PetName,
  PetLocation,
  PetGender,
  PetArrow,
} from './styles';

type IPet = {
  id: string;
  name: string;
  gender: string;
  gender_formatted: string;
  city: string;
  state: string;
  avatar_url: string;
};

export function FavoritesScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const { petsFavorite } = usePetsFavorite();

  const [loadingOnRefreshControlPetList, setLoadingOnRefreshControlPetList] =
    useState(false);
  const [loadingRefreshPetList, setLoadingRefreshPetList] = useState(false);
  const [pets, setPets] = useState<IPet[]>(petsFavorite);

  // FUNCTIONS
  const loadPets = useCallback(async () => {
    setPets(petsFavorite);
  }, [petsFavorite]);

  const handleRefreshPetList = useCallback(async () => {
    setLoadingRefreshPetList(true);
    await loadPets();
    setLoadingRefreshPetList(false);
  }, [loadPets]);

  const handleOnRefreshControlPetList = useCallback(async () => {
    setLoadingOnRefreshControlPetList(true);
    await loadPets();
    setLoadingOnRefreshControlPetList(false);
  }, [loadPets]);

  const handleDetailPetNavigation = useCallback(
    (petId: string) => {
      navigation.navigate('detailPetScreen', { petId });
    },
    [navigation],
  );
  // END FUNCTIONS

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [loadPets]),
  );

  return (
    <Container>
      <HeaderProfileSignIn />

      <Content>
        <Title>Favoritos</Title>

        <BoxPetsContent>
          {pets.length === 0 ? (
            <BoxNoContent>
              <NoContentText>Sem nenhum pet</NoContentText>

              <ReloadButton
                loading={loadingRefreshPetList}
                disabled={loadingRefreshPetList}
                onPress={handleRefreshPetList}
              >
                {loadingRefreshPetList ? (
                  <ActivityIndicator size={29} color={theme.COLORS.WHITE} />
                ) : (
                  <ReloadButtonText>ATUALIZAR</ReloadButtonText>
                )}
              </ReloadButton>
            </BoxNoContent>
          ) : (
            <PetsList
              data={pets}
              keyExtractor={(item) => item.id}
              renderItem={({ item: pet }) => (
                <BoxPet
                  rippleColor={theme.COLORS.PINK_100}
                  onPress={() => {
                    handleDetailPetNavigation(pet.id);
                  }}
                >
                  <PetPhoto
                    source={{ uri: pet.avatar_url }}
                    contentFit="cover"
                  />

                  <PetInformation>
                    <PetName>{pet.name}</PetName>
                    <PetLocation>
                      {pet.city} - {pet.state}
                    </PetLocation>
                    <PetGender>{pet.gender_formatted}</PetGender>
                  </PetInformation>

                  <PetArrow>
                    <Feather
                      name="chevron-right"
                      size={25}
                      color={theme.COLORS['primary-color']}
                    />
                  </PetArrow>
                </BoxPet>
              )}
              refreshControl={
                <RefreshControl
                  colors={[
                    theme.COLORS['primary-color'],
                    theme.COLORS['seconde-color'],
                    theme.COLORS.PINK_200,
                  ]}
                  progressBackgroundColor={theme.COLORS.WHITE}
                  refreshing={loadingOnRefreshControlPetList}
                  onRefresh={handleOnRefreshControlPetList}
                />
              }
            />
          )}
        </BoxPetsContent>
      </Content>
    </Container>
  );
}
