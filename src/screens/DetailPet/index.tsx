import { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  StatusBar,
  Linking,
  Alert,
  BackHandler,
  ActivityIndicator,
} from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/native';

import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
} from 'date-fns';

import Toast from 'react-native-toast-message';

import { useAuth } from '@hooks/auth';
import { usePetsFavorite } from '@hooks/pet_favorite';

import { api } from '@libs/api';

import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import { Loading } from '@components/Loading';
import { ImageSlider } from '@components/ImageSlider';
import { Button } from '@components/Form/Button';

import { useTheme } from 'styled-components/native';

import {
  Container,
  Content,
  BackButton,
  BoxPhotoPet,
  BoxInformation,
  BoxNameFavorite,
  BoxNameLocation,
  PetName,
  PetLocation,
  FavoriteButton,
  BoxFavorite,
  BoxShortInformation,
  ShortInformationView,
  ShortInformationText,
  BoxTutor,
  TutorInfo,
  TutorPhoto,
  TutorName,
  TutorContact,
  ContactButton,
  Title,
  Description,
  BoxAdoption,
} from './styles';
import { IPetDTO } from '../../dtos/pet-dto';
import { useQuery } from '@tanstack/react-query';

type IGender = {
  MALE: string;
  FEMALE: string;
};

type IPetImageFormatted = {
  id: string;
  photo: string;
};

type IDetailPetProps = IPetDTO & {
  size_formatted: string;
  pet_images_formatted: Array<IPetImageFormatted>;
};

type IRouteParams = {
  petId: string;
};

const providerGenderEnum: IGender = {
  MALE: 'Macho',
  FEMALE: 'Fêmea',
};

const sizeEnum = {
  SMALL: 'Pequeno',
  MEDIAN: 'Médio',
  BIG: 'Grande',
};

const DetailPetScreen = () => {
  // const [loading, setLoading] = useState(false);
  // const [pet, setPet] = useState<IPet>();
  const [petFavorite, setIsPetFavorite] = useState(false);

  const { tutor } = useAuth();

  const {
    loading: loadingPetFavorite,
    verifyIsPetFavorite,
    addPetFavorite,
    removePetFavorite,
  } = usePetsFavorite();

  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();

  const { petId } = route.params as IRouteParams;

  const { data: pet, isLoading: isLoadingDetailPet } = useQuery<
    IDetailPetProps | undefined
  >({
    queryKey: ['detailPet', petId],
    queryFn: async () => {
      try {
        const response = await api.get(`/pets/show/${petId}`);

        if (response.status === 200) {
          const petData = response.data as IDetailPetProps;

          let timeYearsOfLife = 0;
          let timeMonthsOfLife = 0;
          let timeDaysOfLife = 0;
          let timeOfLifeText = '';
          let prefix = '';

          timeYearsOfLife = differenceInYears(
            new Date(),
            new Date(petData.birthday),
          );

          if (timeYearsOfLife > 0) {
            prefix = timeYearsOfLife > 1 ? 'anos' : 'ano';

            timeOfLifeText = `${timeYearsOfLife} ${prefix}`;
          } else if (timeYearsOfLife === 0) {
            timeMonthsOfLife = differenceInMonths(
              new Date(),
              new Date(petData.birthday),
            );

            if (timeMonthsOfLife > 0) {
              prefix = timeMonthsOfLife > 1 ? 'meses' : 'mês';

              timeOfLifeText = `${timeMonthsOfLife} ${prefix}`;
            } else if (timeMonthsOfLife === 0) {
              timeDaysOfLife = differenceInDays(
                new Date(),
                new Date(petData.birthday),
              );

              prefix = timeDaysOfLife > 1 ? 'dias' : 'dia';

              timeOfLifeText = `${timeDaysOfLife} ${prefix}`;
            }
          }

          const petImages: IPetImageFormatted[] = [];
          petImages.push({ id: petData.id, photo: petData.avatar_url });

          if (petData.pet_images.length > 0) {
            petData.pet_images.forEach((petImage) => {
              petImages.push({ id: petImage.id, photo: petImage.image_url });
            });
          }

          const petFormatted = {
            ...petData,
            gender_formatted:
              providerGenderEnum[
                petData.gender as keyof typeof providerGenderEnum
              ],
            size_formatted: sizeEnum[petData.size as keyof typeof sizeEnum],
            age_formatted: timeOfLifeText,
            pet_images_formatted: petImages,
          } as IDetailPetProps;

          const petIsFavorite = await verifyIsPetFavorite(petId);

          setIsPetFavorite(petIsFavorite);

          return petFormatted;
        }

        return undefined;
      } catch (err) {
        // NOTE - Review message error
        Toast.show({
          type: 'error',
          text2: 'Não foi possível encontrar as informações',
          position: 'bottom',
        });
      }

      return undefined;
    },
  });

  // FUNCTIONS
  const handleGoBack = useCallback(() => {
    if (navigation.isFocused()) {
      navigation.goBack();
    }
  }, [navigation]);

  const togglePetFavorite = useCallback(() => {
    setIsPetFavorite((oldState) => !oldState);
  }, []);

  const handleFavoritePet = useCallback(
    async (petFavorited: IPetDTO) => {
      try {
        if (petFavorite) {
          removePetFavorite(petFavorited.id);
        } else {
          addPetFavorite(petFavorited);
        }
      } catch {
        Toast.show({
          type: 'error',
          text2: 'Não foi possível adicionar aos favoritos',
          position: 'bottom',
        });
      }
    },
    [addPetFavorite, removePetFavorite, petFavorite],
  );

  const handleWhatsAppMessage = useCallback(() => {
    if (pet) {
      const phoneWithoutSpace = pet.tutor.public_phone.replace(/\s/g, '');
      const phoneWithoutDigitsNotNumerics = phoneWithoutSpace.replace(
        /[^\d]+/g,
        '',
      );

      const phoneFormatted = `+55${phoneWithoutDigitsNotNumerics}`;

      const message = `Olá, ${pet.tutor.name}\nEstou visualizando o perfil de *${pet.name}* e quero fazer a adoção`;
      const messageEncoded = encodeURI(message);

      // const openWhatsApp = `whatsapp://send?&text=${message}&phone${phoneFormatted}`;
      const openURLWhatsApp = `https://wa.me/${phoneFormatted}?text=${messageEncoded}`;

      Linking.openURL(openURLWhatsApp);
    }
  }, [pet]);

  const handlePhoneCall = useCallback(() => {
    if (pet) {
      const phoneWithoutSpace = pet.tutor.public_phone.replace(/\s/g, '');
      const phoneWithoutDigitsNotNumerics = phoneWithoutSpace.replace(
        /[^\d]+/g,
        '',
      );

      const openPhoneCall = `tel://${phoneWithoutDigitsNotNumerics}`;

      Linking.openURL(openPhoneCall);
    }
  }, [pet]);

  const handleNavigateQRCodeScanner = useCallback(() => {
    if (tutor) {
      if (pet) {
        navigation.navigate('adoptMeScannerScreen', {
          petId: pet.id,
          oldTutorId: pet.tutor.id,
        });
      }
    } else {
      // TODO Fazer a navegação para a tela de Login e depois prosseguir com a adoção
      Alert.alert(
        'Geração Pets',
        'Para prosseguir com a adoção precisa acessar sua conta',
        [
          {
            text: 'Fazer login',
            onPress: () => {
              /** REVIEW
               * chamar a tela de login e passar algum parâmetro do pet para ir para leitura do QRCode
               * ou voltar para esta mesma tela
               */
              console.log('Fazer login');
            },
          },
        ],
      );
    }
  }, [navigation, tutor, pet]);
  // END FUNCTIONS

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      handleGoBack();

      return true;
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', () => {
        return true;
      });
    };
  }, [handleGoBack]);

  // useEffect(() => {
  //   async function loadData() {
  //     try {
  //       setLoading(true);

  //       const response = await api.get(`/pets/show/${petId}`);

  //       if (response.status === 200) {
  //         const petData = response.data as IPetDTO;

  //         let timeYearsOfLife = 0;
  //         let timeMonthsOfLife = 0;
  //         let timeDaysOfLife = 0;
  //         let timeOfLifeText = '';
  //         let prefix = '';

  //         timeYearsOfLife = differenceInYears(
  //           new Date(),
  //           new Date(petData.birthday),
  //         );

  //         if (timeYearsOfLife > 0) {
  //           prefix = timeYearsOfLife > 1 ? 'anos' : 'ano';

  //           timeOfLifeText = `${timeYearsOfLife} ${prefix}`;
  //         } else if (timeYearsOfLife === 0) {
  //           timeMonthsOfLife = differenceInMonths(
  //             new Date(),
  //             new Date(petData.birthday),
  //           );

  //           if (timeMonthsOfLife > 0) {
  //             prefix = timeMonthsOfLife > 1 ? 'meses' : 'mês';

  //             timeOfLifeText = `${timeMonthsOfLife} ${prefix}`;
  //           } else if (timeMonthsOfLife === 0) {
  //             timeDaysOfLife = differenceInDays(
  //               new Date(),
  //               new Date(petData.birthday),
  //             );

  //             prefix = timeDaysOfLife > 1 ? 'dias' : 'dia';

  //             timeOfLifeText = `${timeDaysOfLife} ${prefix}`;
  //           }
  //         }

  //         const petImages: Array<IPetImageFormatted> = [];
  //         petImages.push({ id: petData.id, photo: petData.avatar_url });

  //         if (petData.pet_images.length > 0) {
  //           petData.pet_images.forEach((petImage) => {
  //             petImages.push({ id: petImage.id, photo: petImage.image_url });
  //           });
  //         }

  //         const petFormatted = {
  //           ...petData,
  //           gender_formatted:
  //             providerGenderEnum[
  //               petData.gender as keyof typeof providerGenderEnum
  //             ],
  //           size_formatted: sizeEnum[petData.size as keyof typeof sizeEnum],
  //           age_formatted: timeOfLifeText,
  //           pet_images_formatted: petImages,
  //         } as IPetDTO;

  //         const petIsFavorite = await verifyIsPetFavorite(petId);

  //         setIsPetFavorite(petIsFavorite);
  //         setPet(petFormatted);
  //         setLoading(false);
  //       }
  //     } catch (err) {
  //       setLoading(false);
  //       // NOTE - Review message error
  //       Toast.show({
  //         type: 'error',
  //         text2: 'Não foi possível encontrar as informações',
  //         position: 'bottom',
  //       });
  //     }
  //   }

  //   loadData();
  // }, [petId, verifyIsPetFavorite]);

  if (isLoadingDetailPet) {
    return <Loading />;
  }

  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" hidden />

      {pet && (
        <>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <Content>
              <BoxPhotoPet>
                <BackButton onPress={handleGoBack}>
                  <Feather
                    name="chevron-left"
                    size={24}
                    color={theme.COLORS.BLACK}
                  />
                </BackButton>

                <ImageSlider imagesUrl={pet.pet_images_formatted} />

                {/* <PhotoPet
                  source={{ uri: pet.pet_images_formatted[0] }}
                  resizeMode="cover"
                /> */}
              </BoxPhotoPet>

              <BoxInformation>
                <BoxNameFavorite>
                  <BoxNameLocation>
                    <PetName>{pet.name}</PetName>
                    <PetLocation>
                      {pet.city} - {pet.state}
                    </PetLocation>
                  </BoxNameLocation>

                  <FavoriteButton
                    onPress={() => {
                      togglePetFavorite();
                      handleFavoritePet(pet);
                    }}
                  >
                    <BoxFavorite>
                      {loadingPetFavorite ? (
                        <ActivityIndicator
                          size={30}
                          color={theme.COLORS.PINK_200}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="heart"
                          size={30}
                          color={
                            petFavorite
                              ? theme.COLORS.PINK_200
                              : theme.COLORS.GRAY_200
                          }
                        />
                      )}
                    </BoxFavorite>
                  </FavoriteButton>
                </BoxNameFavorite>

                <BoxShortInformation>
                  <ShortInformationView color={theme.COLORS.PURPLE_200}>
                    <ShortInformationText>
                      {pet.gender_formatted}
                    </ShortInformationText>
                  </ShortInformationView>

                  <ShortInformationView color={theme.COLORS.ORANGE_200}>
                    <ShortInformationText>
                      {pet.age_formatted}
                    </ShortInformationText>
                  </ShortInformationView>

                  <ShortInformationView color={theme.COLORS.BLUE_100}>
                    <ShortInformationText>
                      {pet.size_formatted}
                    </ShortInformationText>
                    {/* <ShortInformationText>{pet.weight} Kg</ShortInformationText> */}
                  </ShortInformationView>
                </BoxShortInformation>

                <BoxTutor>
                  <TutorInfo>
                    <TutorPhoto
                      source={{ uri: pet.tutor.avatar_url }}
                      contentFit="cover"
                    />
                    <TutorName>{pet.tutor.name}</TutorName>
                  </TutorInfo>

                  <TutorContact>
                    <ContactButton
                      color={theme.COLORS.GREEN_100}
                      onPress={handleWhatsAppMessage}
                    >
                      <MaterialCommunityIcons
                        name="message-text"
                        size={25}
                        color={theme.COLORS.WHITE}
                      />
                    </ContactButton>

                    <ContactButton
                      color={theme.COLORS.ORANGE_100}
                      onPress={handlePhoneCall}
                    >
                      <MaterialCommunityIcons
                        name="phone"
                        size={25}
                        color={theme.COLORS.WHITE}
                      />
                    </ContactButton>
                  </TutorContact>
                </BoxTutor>

                <Title>Detalhes</Title>
                <Description>{pet.description}</Description>
              </BoxInformation>
            </Content>
          </ScrollView>

          <BoxAdoption>
            <Button onPress={handleNavigateQRCodeScanner}>Adote me</Button>
          </BoxAdoption>
        </>
      )}

      {/* TOAST AND MODALS */}
      {/* <ToastMessage /> */}
    </Container>
  );
};

export { DetailPetScreen };
