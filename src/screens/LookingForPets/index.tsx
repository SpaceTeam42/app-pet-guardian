import { useState, useCallback, useRef } from 'react';

import {
  Keyboard,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { api } from '@libs/api';

import axios, { AxiosError } from 'axios';

import { useQuery } from '@tanstack/react-query';

import { useDebouncedCallback } from 'use-debounce';

import Toast from 'react-native-toast-message';

import { Feather } from '@expo/vector-icons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ILookingForPetDTO } from 'src/dtos/looking-fot-pet-dto';

import { useTheme } from 'styled-components/native';

import { HeaderProfileSignIn } from '@components/HeaderProfileSignIn';
import { Loading } from '@components/Loading';

import {
  Container,
  Content,
  Title,
  BoxSearchContent,
  BoxSearch,
  SearchTextInput,
  // SearchButton,
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

interface IGender {
  MALE: string;
  FEMALE: string;
}

// interface IPet {
//   id: string;
//   name_pet: string;
//   gender: string;
//   gender_formatted: string;
//   city: string;
//   state: string;
//   avatar_url: string;
// }

const providerGenderEnum: IGender = {
  MALE: 'Macho',
  FEMALE: 'Fêmea',
};

export function LookingForPetsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const searchInputRef = useRef<TextInput>(null);

  const [loadingOnRefreshControlPetList, setLoadingOnRefreshControlPetList] =
    useState(false);
  const [loadingRefreshPetList, setLoadingRefreshPetList] = useState(false);
  const [searchInputFocus, setIsSearchInputFocus] = useState(false);
  const [searchPets, setSearchPets] = useState<ILookingForPetDTO[]>([]);

  // FUNCTIONS
  const handleSearchInputFocus = useCallback(() => {
    setIsSearchInputFocus(true);
  }, []);

  const handleSearchInputBlur = useCallback(() => {
    setIsSearchInputFocus(false);
  }, []);

  const handleSearchTerm = useDebouncedCallback((term: string) => {
    if (term !== '') {
      setIsSearchInputFocus(false);
      const searchPetsCopy = searchPets;

      const petsSearch = searchPetsCopy.filter((pet) =>
        pet.name_pet.toUpperCase().includes(term.toUpperCase()),
      );

      setSearchPets(petsSearch);
    } else {
      setSearchPets([]);
    }

    Keyboard.dismiss();
  }, 500);

  const {
    data: pets,
    isLoading: isLoadingLookingForPets,
    refetch: refreshPets,
  } = useQuery<ILookingForPetDTO[] | undefined>({
    queryKey: ['lookingForPets'],
    queryFn: async () => {
      try {
        const response = await api.get('/looking_for_pets', {
          params: {
            is_found: false,
            enabled: true,
          },
        });

        const petsData = response.data as ILookingForPetDTO[];

        const petsFormatted = petsData.map<ILookingForPetDTO>((pet) => {
          return {
            ...pet,
            gender_formatted:
              providerGenderEnum[pet.gender as keyof typeof providerGenderEnum],
          };
        });

        return petsFormatted;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorAxios = err as AxiosError;

          // REVIEW - colocar o tratamento correto da exceção
          Toast.show({
            type: 'error',
            text2: errorAxios.message,
            position: 'bottom',
          });
        }
      }
    },
  });

  const handleRefreshPetList = useCallback(async () => {
    setLoadingRefreshPetList(true);
    searchInputRef.current?.clear();
    await refreshPets();
    setLoadingRefreshPetList(false);
  }, [refreshPets]);

  const handleOnRefreshControlPetList = useCallback(async () => {
    setLoadingOnRefreshControlPetList(true);
    await refreshPets();
    setLoadingOnRefreshControlPetList(false);
  }, [refreshPets]);

  const handleDetailPetNavigation = useCallback(
    (petId: string) => {
      navigation.navigate('detailLookingForPetScreen', { petId });
    },
    [navigation],
  );
  // END FUNCTIONS

  return (
    <Container>
      <HeaderProfileSignIn />

      <Content>
        <Title>Procura-se</Title>

        <BoxSearchContent>
          <BoxSearch isFocused={searchInputFocus}>
            <Feather
              name="search"
              size={25}
              color={
                searchInputFocus
                  ? theme.COLORS['primary-color']
                  : theme.COLORS.GRAY_200
              }
            />

            <SearchTextInput
              ref={searchInputRef}
              placeholder="Pesquisar"
              onFocus={handleSearchInputFocus}
              onBlur={handleSearchInputBlur}
              onChangeText={(text) => handleSearchTerm(text)}
            />
          </BoxSearch>

          {/* <SearchButton onPress={handleSearchTerm}>
            <MaterialCommunityIcons
              name="tune-variant"
              size={25}
              color={theme.colors['white-color']}
            />
          </SearchButton> */}
        </BoxSearchContent>

        {isLoadingLookingForPets ? (
          <Loading />
        ) : (
          <BoxPetsContent>
            {pets && pets.length === 0 ? (
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
                data={searchPets.length === 0 ? pets : searchPets}
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
                      resizeMode="cover"
                    />

                    <PetInformation>
                      <PetName>{pet.name_pet}</PetName>
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
        )}
      </Content>
    </Container>
  );
}
