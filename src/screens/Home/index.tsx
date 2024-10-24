import { useCallback, useState, useRef } from 'react';

import {
  Keyboard,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useDebouncedCallback } from 'use-debounce';

// import { BarCodeScanner } from 'expo-barcode-scanner';
// import { useCameraPermission } from 'react-native-vision-camera';

import { useQuery } from '@tanstack/react-query';

import { api } from '@libs/api';

import axios, { AxiosError } from 'axios';

// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Feather } from '@expo/vector-icons';

// import Lottie from 'lottie-react-native';

// import petHub from '@assets/pet-hug.json';

import { useTheme } from 'styled-components/native';

import { HeaderProfileSignIn } from '@components/HeaderProfileSignIn';
import { Loading } from '@components/Loading';

import {
  HomeContainer,
  HomeContent,
  HomeContentBackground,
  HomeBoxNoContent,
  HomeNoContentText,
  ReloadButton,
  ReloadButtonText,
  BoxSearchContent,
  BoxSearch,
  SearchTextInput,
  // SearchButton,
  BoxCategories,
  CategoriesList,
  CategoryButton,
  CategoryButtonImage,
  BoxPetsContent,
  PetList,
  BoxPet,
  PetPhoto,
  PetInformation,
  PetName,
  PetLocation,
  PetGender,
  PetArrow,
} from './styles';

type IGender = {
  MALE: string;
  FEMALE: string;
};

type ICategory = {
  id: string;
  icon_url: string;
};

type IPet = {
  id: string;
  name: string;
  gender: string;
  gender_formatted: string;
  category: ICategory;
  city: string;
  state: string;
  avatar_url: string;
};

const providerGenderEnum: IGender = {
  MALE: 'Macho',
  FEMALE: 'Fêmea',
};

export function HomeScreen() {
  // const [loading, setLoading] = useState(false);
  const [loadingOnRefreshControlPetList, setLoadingOnRefreshControlPetList] =
    useState(false);
  const [loadingRefreshPetList, setLoadingRefreshPetList] = useState(false);
  const [searchInputFocus, setIsSearchInputFocus] = useState(false);
  // const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  // const [pets, setPets] = useState<IPet[]>([]);
  const [searchPets, setSearchPets] = useState<IPet[]>([]);

  const theme = useTheme();
  const navigation = useNavigation();

  const searchInputRef = useRef<TextInput>(null);

  // const { hasPermission, requestPermission } = useCameraPermission();

  // QUERIES
  const {
    data: categories,
    isLoading: isLoadingCategories,
    refetch: categoriesRefetch,
  } = useQuery({
    queryKey: ['homeCategories'],
    queryFn: async () => {
      try {
        // NOTE - params: is used to send query params
        const response = await api.get('/categories', {
          params: { enabled: true },
        });

        if (response.status === 200) {
          return response.data;
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorAxios = err as AxiosError;

          // REVIEW colocar o tratamento correto da exceção
          console.log(errorAxios);
        }
      }

      return [];
    },
  });

  const {
    data: pets,
    isLoading: isLoadingPets,
    refetch: petsRefetch,
  } = useQuery({
    queryKey: ['homePets'],
    queryFn: async () => {
      try {
        // NOTE - params: is used to send query params
        const response = await api.get('/pets', {
          params: { adopted: false },
        });

        if (response.status === 200) {
          const petData = response.data as IPet[];

          const petsFormatted = petData.map((pet) => {
            return {
              ...pet,
              gender_formatted:
                providerGenderEnum[
                  pet.gender as keyof typeof providerGenderEnum
                ],
            };
          });

          // setPets(petsFormatted);
          // setSearchPets(petsFormatted);

          return petsFormatted;
        }
      } catch (err) {
        setSearchPets([]);

        if (axios.isAxiosError(err)) {
          const errorAxios = err as AxiosError;

          // REVIEW colocar o tratamento correto da exceção
          console.log(errorAxios);
        }
      }

      return [];
    },
  });
  // END QUEIRES

  // FUNCTIONS
  const handleSearchInputFocus = useCallback(() => {
    setIsSearchInputFocus(true);
  }, []);

  const handleSearchInputBlur = useCallback(() => {
    setIsSearchInputFocus(false);
  }, []);

  const handleSelectedCategory = useCallback(
    (categoryId: string) => {
      if (categoryId === selectedCategory) {
        setSelectedCategory('');
        setSearchPets([]);
      } else {
        if (pets) {
          setSelectedCategory(categoryId);

          const petsFilter = pets.filter(
            (pet) => pet.category.id === categoryId,
          );

          setSearchPets(petsFilter);
        }
      }
    },
    [selectedCategory, pets],
  );

  const handleSearchTerm = useDebouncedCallback((term: string) => {
    if (term !== '') {
      setIsSearchInputFocus(false);
      if (pets) {
        const searchPetsCopy = pets;

        const petsSearch = searchPetsCopy.filter((pet) =>
          pet.name.toUpperCase().includes(term.toUpperCase()),
        );

        setSearchPets(petsSearch);
      }
    } else {
      setSearchPets([]);
    }

    Keyboard.dismiss();
  }, 500);

  // MANUAL WAY OF DO DEBOUNCE
  // const handleSearchTerm = useCallback(
  //   (term: string) => {
  //     // Keyboard.dismiss();

  //     setTimeout(() => {
  //       if (term !== '') {
  //         setIsSearchInputFocus(false);
  //         const searchPetsCopy = searchPets;

  //         const petSearch = searchPetsCopy.filter(pet =>
  //           pet.name.toUpperCase().includes(term.toUpperCase()),
  //         );

  //         setPets(petSearch);
  //       } else {
  //         setPets(searchPets);
  //       }
  //     }, 1000);
  //   },
  //   [searchPets],
  // );

  const handleDetailPetNavigation = useCallback(
    (petId: string) => {
      navigation.navigate('detailPetScreen', { petId });
    },
    [navigation],
  );

  // const loadCategories = useCallback(async () => {
  //   try {
  //     // NOTE - params: is used to send query params
  //     const response = await api.get('/categories', {
  //       params: { enabled: true },
  //     });

  //     if (response.status === 200) {
  //       setCategories(response.data);
  //     }
  //   } catch (err) {
  //     setCategories([]);

  //     if (axios.isAxiosError(err)) {
  //       const errorAxios = err as AxiosError;

  //       // REVIEW colocar o tratamento correto da exceção
  //       console.log(errorAxios);
  //     }
  //   }
  // }, []);

  // const loadPets = useCallback(async () => {
  //   try {
  //     // NOTE - params: is used to send query params
  //     const response = await api.get('/pets', {
  //       params: { adopted: false },
  //     });

  //     if (response.status === 200) {
  //       const petData = response.data as IPet[];

  //       const petsFormatted = petData.map((pet) => {
  //         return {
  //           ...pet,
  //           gender_formatted:
  //             providerGenderEnum[pet.gender as keyof typeof providerGenderEnum],
  //         };
  //       });

  //       setPets(petsFormatted);
  //       setSearchPets(petsFormatted);
  //     }
  //   } catch (err) {
  //     setPets([]);
  //     setSearchPets([]);

  //     if (axios.isAxiosError(err)) {
  //       const errorAxios = err as AxiosError;

  //       // REVIEW colocar o tratamento correto da exceção
  //       console.log(errorAxios);
  //     }
  //   }
  // }, []);

  const handleOnRefreshControlPetList = useCallback(async () => {
    setLoadingOnRefreshControlPetList(true);
    categoriesRefetch();
    petsRefetch();
    setLoadingOnRefreshControlPetList(false);
  }, [petsRefetch, categoriesRefetch]);

  const handleRefreshPetList = useCallback(async () => {
    setLoadingRefreshPetList(true);
    searchInputRef.current?.clear();
    categoriesRefetch();
    petsRefetch();
    setLoadingRefreshPetList(false);
  }, [petsRefetch, categoriesRefetch]);

  // const loadData = useCallback(async () => {
  //   setLoading(true);
  //   await loadCategories();
  //   await loadPets();
  //   setLoading(false);
  // }, [loadCategories, loadPets]);

  // const checkCameraPermission = useCallback(async () => {
  //   if (!hasPermission) {
  //     try {
  //       await requestPermission();
  //     } catch (err) {
  //       Alert.alert(
  //         'Geração Pets',
  //         'Precisamos da permissão para acessar a câmera',
  //         [
  //           {
  //             text: 'Conceder permissão de acesso a câmera',
  //             style: 'default',
  //             onPress: async () => {
  //               await requestPermission();
  //             },
  //           },
  //           {
  //             text: 'Cancelar',
  //             style: 'default',
  //             onPress: () => null,
  //           },
  //         ],
  //       );
  //     }
  //   }
  // }, [hasPermission, requestPermission]);

  // END FUNCTIONS

  // REVIEW - PERMISSION TO ACCESS CAMERA
  // useEffect(() => {
  //   checkCameraPermission();
  // }, [checkCameraPermission]);

  // useEffect(() => {
  //   loadData();
  // }, [loadData]);

  return (
    <HomeContainer>
      <HeaderProfileSignIn />

      <HomeContent>
        <HomeContentBackground>
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

            {/* <SearchButton>
                  <MaterialCommunityIcons
                    name="tune-variant"
                    size={25}
                    color={theme.colors['white-color']}
                  />
                </SearchButton> */}
          </BoxSearchContent>

          {isLoadingCategories && isLoadingPets ? (
            <Loading />
          ) : (
            <>
              <BoxCategories>
                <CategoriesList
                  data={categories}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item: category }) => (
                    <CategoryButton
                      is_selected={selectedCategory === category.id}
                      onPress={() => {
                        handleSelectedCategory(category.id);
                      }}
                    >
                      <CategoryButtonImage
                        source={{ uri: category.icon_url }}
                        contentFit="contain"
                      />
                    </CategoryButton>
                  )}
                />
              </BoxCategories>

              <BoxPetsContent>
                {pets && pets.length === 0 ? (
                  <HomeBoxNoContent>
                    <>
                      {/* <Lottie
                          source={petHub}
                          style={{ height: RFValue(180) }}
                          autoPlay
                          loop
                          autoSize
                          resizeMode="cover"
                        /> */}

                      <HomeNoContentText>
                        {`Nenhum pet encontrado para adoção.\nSignifica que todos foram adotados.\nUHUUU!!!`}
                      </HomeNoContentText>

                      <ReloadButton
                        loading={loadingRefreshPetList}
                        onPress={handleRefreshPetList}
                        disabled={loadingRefreshPetList}
                      >
                        {loadingRefreshPetList ? (
                          <ActivityIndicator
                            size={29}
                            color={theme.COLORS.WHITE}
                          />
                        ) : (
                          <ReloadButtonText>ATUALIZAR</ReloadButtonText>
                        )}
                      </ReloadButton>
                    </>
                  </HomeBoxNoContent>
                ) : (
                  <PetList
                    data={searchPets.length > 0 ? searchPets : pets}
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
            </>
          )}
        </HomeContentBackground>
      </HomeContent>
    </HomeContainer>
  );
}
