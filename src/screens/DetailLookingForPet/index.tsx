import { useCallback, useEffect } from 'react';
import { StatusBar, ScrollView, Linking, BackHandler } from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/native';

import { api } from '@libs/api';
import axios, { AxiosError } from 'axios';

import Toast from 'react-native-toast-message';

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { useQuery } from '@tanstack/react-query';

import { ILookingForPetDTO } from '../../dtos/looking-fot-pet-dto';

import { Loading } from '@components/Loading';
import { ImageSlider } from '@components/ImageSlider';

import { useTheme } from 'styled-components/native';

import {
  Container,
  Content,
  BackButton,
  BoxPhotoPet,
  BoxInformation,
  Title,
  Text,
  BoxNameGenderLocation,
  PetName,
  PetGender,
  PetLocation,
  BoxTutor,
  BoxTutorInfo,
  TutorInfo,
  TutorName,
  TutorContact,
  ContactButton,
  BoxLastSeen,
  BoxDescription,
} from './styles';

type ILookingForPetRouteParams = {
  petId: string;
};

type IGender = {
  MALE: string;
  FEMALE: string;
};

type ILookingForPetImageFormatted = {
  id: string;
  photo: string;
};

type IDetailLookingForPet = ILookingForPetDTO & {
  looking_for_pet_images_formatted: Array<ILookingForPetImageFormatted>;
};

const providerGenderEnum: IGender = {
  MALE: 'Macho',
  FEMALE: 'Fêmea',
};

const DetailLookingForPetScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();

  const { petId } = route.params as ILookingForPetRouteParams;

  // QUERY
  const { data: pet, isLoading: isLoadingDetailPet } = useQuery<
    IDetailLookingForPet | undefined
  >({
    queryKey: ['detailLookingForPets', petId],
    queryFn: async () => {
      try {
        const response = await api.get(`/looking_for_pets/show/${petId}`);

        if (response.status === 200) {
          const petData = response.data as IDetailLookingForPet;

          const lookingForPetImages: Array<ILookingForPetImageFormatted> = [];
          lookingForPetImages.push({
            id: petData.id,
            photo: petData.avatar_url,
          });

          if (petData.looking_for_pet_images.length > 0) {
            petData.looking_for_pet_images.forEach((lookingForPetImage) => {
              lookingForPetImages.push({
                id: lookingForPetImage.id,
                photo: lookingForPetImage.image_url,
              });
            });
          }

          const petFormatted = {
            ...petData,
            gender_formatted:
              providerGenderEnum[
                petData.gender as keyof typeof providerGenderEnum
              ],
            looking_for_pet_images_formatted: lookingForPetImages,
          } as IDetailLookingForPet;

          return petFormatted;
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorAxios = err as AxiosError;

          if (errorAxios.response) {
            Toast.show({
              type: 'error',
              text2: errorAxios.response.status.toString(),
              position: 'bottom',
            });
          }
        }
      }

      return undefined;
    },
  });
  // END QUERY

  // FUNCTIONS
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleWhatsAppMessage = useCallback(() => {
    if (pet) {
      const phoneWithoutSpace = pet.phone_tutor.replace(/\s/g, '');
      const phoneWithoutDigitsNotNumerics = phoneWithoutSpace.replace(
        /[^\d]+/g,
        '',
      );

      const phoneFormatted = `+55${phoneWithoutDigitsNotNumerics}`;

      const message = `Olá, ${pet.name_tutor}\nEstou visualizando o perfil de *${pet.name_pet}* e quero fazer a adoção`;
      const messageEncoded = encodeURI(message);

      // const openWhatsApp = `whatsapp://send?&text=${message}&phone${phoneFormatted}`;
      const openURLWhatsApp = `https://wa.me/${phoneFormatted}?text=${messageEncoded}`;

      Linking.openURL(openURLWhatsApp);
    }
  }, [pet]);

  const handlePhoneCall = useCallback(() => {
    if (pet) {
      const phoneWithoutSpace = pet.phone_tutor.replace(/\s/g, '');
      const phoneWithoutDigitsNotNumerics = phoneWithoutSpace.replace(
        /[^\d]+/g,
        '',
      );

      const openPhoneCall = `tel://${phoneWithoutDigitsNotNumerics}`;

      Linking.openURL(openPhoneCall);
    }
  }, [pet]);
  // END FUNCTIONS

  // ------
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

  if (isLoadingDetailPet) {
    return <Loading />;
  }

  return (
    <Container>
      <StatusBar backgroundColor="transparent" translucent hidden />
      {pet && (
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

              <ImageSlider imagesUrl={pet.looking_for_pet_images_formatted} />

              {/* <PhotoPet source={{ uri: pet.avatar_url }} resizeMode="cover" /> */}
            </BoxPhotoPet>

            <BoxInformation>
              <BoxNameGenderLocation>
                <PetName>{pet.name_pet}</PetName>
                <PetGender>{pet.gender_formatted}</PetGender>
                <PetLocation>
                  {pet.city} - {pet.state}
                </PetLocation>
              </BoxNameGenderLocation>

              <BoxTutor>
                <Title>Tutor</Title>
                <BoxTutorInfo>
                  <TutorInfo>
                    <TutorName>{pet.name_tutor}</TutorName>
                  </TutorInfo>

                  <TutorContact>
                    {pet.phone_tutor_is_whatsapp && (
                      <ContactButton
                        color={theme.colors['green-light-color']}
                        onPress={handleWhatsAppMessage}
                      >
                        <MaterialCommunityIcons
                          name="message-text"
                          size={25}
                          color={theme.colors['white-color']}
                        />
                      </ContactButton>
                    )}

                    <ContactButton
                      color={theme.colors['orange-light-color']}
                      onPress={handlePhoneCall}
                    >
                      <MaterialCommunityIcons
                        name="phone"
                        size={25}
                        color={theme.colors['white-color']}
                      />
                    </ContactButton>
                  </TutorContact>
                </BoxTutorInfo>
              </BoxTutor>

              <BoxLastSeen>
                <Title>Última vez visto</Title>

                <Text>{pet.last_seen}</Text>
              </BoxLastSeen>

              <BoxDescription>
                <Title>Descrição</Title>

                <Text>{pet.description}</Text>
              </BoxDescription>
            </BoxInformation>
          </Content>
        </ScrollView>
      )}

      {/* TOAST AND MODALS */}
      {/* <ToastMessage /> */}
    </Container>
  );
};

export { DetailLookingForPetScreen };
