import { useRef, useCallback, useState, useMemo } from 'react';
import { Keyboard, ScrollView, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { RFValue } from 'react-native-responsive-fontsize';

import { Feather } from '@expo/vector-icons';

import { useForm } from 'react-hook-form';

import { z as zod } from 'zod';

import { api } from '@libs/api';

import { useAuth } from '@hooks/auth';

import RNPickerSelect from 'react-native-picker-select';

import * as ImagePicker from 'expo-image-picker';

import { Image } from 'react-native-compressor';

import Toast from 'react-native-toast-message';

import axios, { AxiosError } from 'axios';

import { loadUF } from '@utils/load-uf';

import { useTheme } from 'styled-components/native';

import { Header } from '@components/Header';
import { Input } from '@components/Form/Input';
import { InputMask } from '@components/Form/InputMask';
import { Button } from '@components/Form/Button';
import { LoadingModal } from '@components/LoadingModal';
import { ChooseTakePhotoModal } from '@components/ChooseTakePhotoModal';

import {
  Container,
  Content,
  BoxPhoto,
  BoxWithoutPhoto,
  PhotoButton,
  PhotoImage,
  BoxPhotoCameraIconButton,
  BoxPhotoDeleteIconButton,
  BoxPhoneWhatsApp,
  WhatsAppCheckButton,
  WhatsAppCheckButtonText,
  BoxPostalCode,
  SearchPostalCodeButton,
  Label,
  BoxState,
  BoxCity,
  Footer,
} from './styles';

type ICity = {
  nome: string;
};

type ICitySelectPicker = {
  label: string;
  value: string;
};

type IResultViaCEP = {
  logradouro: string;
  bairro: string;
  uf: string;
  localidade: string;
};

// interface IFormSubmitData {
//   name: string;
//   cnpj_cpf: string;
//   email: string;
//   password: string;
//   personal_phone: string;
//   public_phone: string;
//   postal_code: string;
//   street_name: string;
//   street_number: string;
//   complement: string;
//   neighborhood: string;
//   reference: string;
// }

const signUpFormValidationSchema = zod.object({
  name: zod.string(),
  cnpj_cpf: zod.string(),
  email: zod.string().email('Digite um e-mail válido'),
  password: zod.string(),
  personal_phone: zod.string(),
  public_phone: zod.string(),
  postal_code: zod.string().optional(),
  street_name: zod.string(),
  street_number: zod.string(),
  complement: zod.string().optional(),
  neighborhood: zod.string(),
  reference: zod.string().optional(),
});

type IFormData = zod.infer<typeof signUpFormValidationSchema>;

// const schemaValidation = Yup.object().shape({
//   name: Yup.string().required('Nome obrigatório'),
//   cnpj_cpf: Yup.string().required('CPF obrigatório'),
//   email: Yup.string()
//     .email('Digite um e-mail válido')
//     .required('E-mail obrigatório'),
//   password: Yup.string().required('Senha obrigatória'),
//   personal_phone: Yup.string().required('Telefone pessoal obrigatório'),
//   public_phone: Yup.string().required('Telefone público obrigatório'),
//   street_name: Yup.string().required('Endereço obrigatório'),
//   street_number: Yup.string().required('Número obrigatório'),
//   neighborhood: Yup.string().required('Bairro obrigatório'),
// });

export function SignUpScreen() {
  // STATUS
  const [openTakePhotoTutorModal, setIsOpenTakePhotoTutorModal] =
    useState(false);
  const [photoTutor, setPhotoTutor] = useState('');
  const [isPersonalPhoneWhatsApp, setIsPersonalPhoneWhatsApp] = useState(false);
  const [isPublicPhoneWhatsApp, setIsPublicPhoneWhatsApp] = useState(false);
  const [searchPostalCode, setSearchPostalCode] = useState('');
  const [selectedUF, setSelectedUF] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [citiesSelectPicker, setCitiesSelectPicker] = useState<
    ICitySelectPicker[]
  >([]);
  const [loadingModal, setIsLoadingModal] = useState(false);
  const [loading, setIsLoading] = useState(false);
  // STATUS

  const theme = useTheme();
  const navigation = useNavigation();

  const { signIn } = useAuth();

  const nameRef = useRef<TextInput>(null);
  const cpfRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const postalCodeRef = useRef<TextInput>(null);
  const streetNameRef = useRef<TextInput>(null);
  const streetNumberRef = useRef<TextInput>(null);
  const neighborhoodRef = useRef<TextInput>(null);
  const complementRef = useRef<TextInput>(null);
  const referenceRef = useRef<TextInput>(null);

  const { control, handleSubmit, reset, setValue } = useForm<IFormData>();

  // MEMO
  const chevronIconSelectPicker = useMemo(() => {
    return (
      <Feather name="chevron-down" size={25} color={theme.COLORS.GRAY_500} />
    );
  }, [theme.COLORS.GRAY_500]);
  // END MEMO

  // FUNCTIONS
  const handleToggleTakePhotoTutorModal = useCallback(() => {
    Keyboard.dismiss();

    setIsOpenTakePhotoTutorModal((oldState) => !oldState);
  }, []);

  const handleTakePhoto = useCallback(async () => {
    const photoSelected = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (photoSelected.canceled) {
      handleToggleTakePhotoTutorModal();

      return;
    }

    if (photoSelected.assets[0].uri) {
      const responseImageCompressor = await Image.compress(
        photoSelected.assets[0].uri,
        {
          quality: 0.8,
          output: 'jpg',
        },
      );

      handleToggleTakePhotoTutorModal();

      setPhotoTutor(responseImageCompressor);
    }
  }, [handleToggleTakePhotoTutorModal]);

  const handleTakeGallery = useCallback(async () => {
    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (photoSelected.canceled) {
      handleToggleTakePhotoTutorModal();
      return;
    }

    if (photoSelected.assets[0].uri) {
      const responseImageCompressor = await Image.compress(
        photoSelected.assets[0].uri,
        {
          quality: 0.8,
          output: 'jpg',
        },
      );

      handleToggleTakePhotoTutorModal();

      setPhotoTutor(responseImageCompressor);
    }
  }, [handleToggleTakePhotoTutorModal]);

  const handleDeletePhoto = useCallback(() => {
    setPhotoTutor('');
  }, []);

  const handlePersonalPhoneWhatsAppCheck = useCallback(() => {
    setIsPersonalPhoneWhatsApp((oldState) => !oldState);
  }, []);

  const handlePublicPhoneWhatsAppCheck = useCallback(() => {
    setIsPublicPhoneWhatsApp((oldState) => !oldState);
  }, []);

  const handleSelectedUF = useCallback(async (uf: string) => {
    setIsLoadingModal(true);
    setSelectedUF(uf);
    setSelectedCity('');

    if (uf !== '') {
      try {
        const response = await axios.get<ICity[]>(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos?orderBy=nome`,
        );

        const dataCitySelectPicker = response.data.map((city) => {
          return {
            label: city.nome,
            value: city.nome,
          };
        });

        setCitiesSelectPicker(dataCitySelectPicker);
        setIsLoadingModal(false);
      } catch {
        setIsLoadingModal(false);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text2: 'Ops! Não conseguimos carregar as cidades!',
        });
      }
    } else {
      setCitiesSelectPicker([]);
      setIsLoadingModal(false);
    }
  }, []);

  const handleSearchAddressByPostalCode = useCallback(async () => {
    try {
      const searchPostalCodeCopy = searchPostalCode;

      const postalCode = searchPostalCodeCopy.replace(/\D/g, '');

      if (postalCode !== '') {
        const validatePostalCodeExpression = /^[0-9]{8}$/;

        if (validatePostalCodeExpression.test(postalCode)) {
          setIsLoadingModal(true);

          const result = await axios.get(
            `https://viacep.com.br/ws/${postalCode}/json/`,
          );

          const { erro } = result.data;

          if (erro) {
            Toast.show({
              type: 'error',
              position: 'bottom',
              text2: 'CEP não encontrado',
            });

            reset();
          } else {
            const { logradouro, bairro, uf, localidade } =
              result.data as IResultViaCEP;

            setValue('street_name', logradouro);
            setValue('neighborhood', bairro);
            setSelectedUF(uf);
            setSelectedCity(localidade);
          }

          setIsLoadingModal(false);
        } else {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text2: 'Formato de CEP inválido',
          });
        }
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text2: 'Informe o CEP',
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorAxios = err as AxiosError;

        if (errorAxios.response) {
          if (errorAxios.response.status === 400) {
            Toast.show({
              type: 'error',
              position: 'bottom',
              text2: 'Formato de CEP inválido',
            });
          }
        }
      }
    }
  }, [searchPostalCode, reset, setValue]);

  const handleFormSubmit = useCallback(
    async (formSubmitData: IFormData) => {
      try {
        setIsLoading(true);

        if (photoTutor === '') {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text2: 'Foto obrigatória',
          });

          return;
        }

        if (selectedUF === '') {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text2: 'Selecione um estados',
          });

          return;
        }

        if (selectedCity === '') {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text2: 'Selecione uma cidade',
          });

          return;
        }

        const formData = new FormData();

        formData.append('name', formSubmitData.name);
        formData.append('email', formSubmitData.email);
        formData.append('password', formSubmitData.password);
        formData.append('type', 'TUTOR');
        formData.append('cnpj_cpf', formSubmitData.cnpj_cpf);
        formData.append('personal_phone', formSubmitData.personal_phone);
        formData.append(
          'personal_phone_is_whatsapp',
          isPersonalPhoneWhatsApp ? 'true' : 'false',
        );
        formData.append('public_phone', formSubmitData.public_phone);
        formData.append(
          'public_phone_is_whatsapp',
          isPublicPhoneWhatsApp ? 'true' : 'false',
        );
        formData.append('street_name', formSubmitData.street_name);
        formData.append('street_number', formSubmitData.street_number);
        formData.append(
          'complement',
          formSubmitData.complement ? formSubmitData.complement : '',
        );
        formData.append('neighborhood', formSubmitData.neighborhood);
        formData.append(
          'postal_code',
          formSubmitData.postal_code ? formSubmitData.postal_code : '',
        );
        formData.append(
          'reference',
          formSubmitData.reference ? formSubmitData.reference : '',
        );
        formData.append('state', selectedUF);
        formData.append('city', selectedCity);

        if (photoTutor !== '') {
          const avatar = {
            name: `img_${formSubmitData.cnpj_cpf}_${new Date()
              .getTime()
              .toString()}.jpg`,
            type: 'image/*',
            uri: photoTutor,
          } as any;

          formData.append('avatar', avatar);
        }

        const response = await api.post('/tutors', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          transformRequest: (data) => data,
        });

        if (response.status === 201) {
          await signIn({
            email: formSubmitData.email,
            password: formSubmitData.password,
          });

          setIsLoading(false);

          Toast.show({
            type: 'success',
            position: 'bottom',
            text2: 'Criação de conta realizada com sucesso!',
          });

          navigation.navigate('homeDrawer', { screen: 'homeTabs' });
          // navigation.navigate('HomeDrawer', { screen: 'HomeTabs' });
        }
      } catch (err) {
        console.log('error: ', err);

        setIsLoading(false);

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        if (err instanceof AxiosError) {
          if (err.response) {
            console.log(JSON.stringify(err.response, null, 2));
          }
        }

        Toast.show({
          type: 'error',
          position: 'bottom',
          text2: 'Não foi possível realizar o cadastro',
        });
      }
    },
    [
      selectedUF,
      selectedCity,
      isPersonalPhoneWhatsApp,
      isPublicPhoneWhatsApp,
      photoTutor,
      navigation,
      signIn,
    ],
  );
  // END FUNCTIONS

  return (
    <Container>
      <Header title="Crie sua conta" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Content>
          <BoxPhoto>
            <PhotoButton>
              {photoTutor === '' ? (
                <BoxWithoutPhoto>
                  <FeatherIcons
                    name="user"
                    size={120}
                    color={theme.colors['gray-color']}
                  />
                </BoxWithoutPhoto>
              ) : (
                <PhotoImage
                  source={{
                    // uri: 'https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
                    uri: photoTutor,
                  }}
                  resizeMode="cover"
                />
              )}

              <BoxPhotoCameraIconButton
                onPress={handleToggleTakePhotoTutorModal}
              >
                <FeatherIcons
                  name="camera"
                  size={24}
                  color={theme.colors['white-color']}
                />
              </BoxPhotoCameraIconButton>

              {photoTutor !== '' && (
                <BoxPhotoDeleteIconButton onPress={handleDeletePhoto}>
                  <FeatherIcons
                    name="x"
                    size={24}
                    color={theme.colors['white-color']}
                  />
                </BoxPhotoDeleteIconButton>
              )}
            </PhotoButton>
          </BoxPhoto>

          <Form ref={formRef} onSubmit={handleFormSubmit}>
            <Input
              ref={nameRef}
              name="name"
              label="Nome"
              autoCorrect={false}
              autoCapitalize="words"
              editable={!loading}
              returnKeyType="next"
            />

            <InputMask
              ref={cpfRef}
              name="cnpj_cpf"
              label="CPF"
              type="cpf"
              editable={!loading}
              keyboardType="numeric"
              returnKeyType="next"
            />

            <Input
              ref={emailRef}
              name="email"
              label="E-mail"
              editable={!loading}
              keyboardType="email-address"
              returnKeyType="next"
            />

            <Input
              ref={passwordRef}
              name="password"
              label="Senha"
              editable={!loading}
              secureTextFieldEntry
              returnKeyType="next"
            />

            <Label>DDD + telefone (utilizado para entrarmos em contato)</Label>
            <BoxPhoneWhatsApp>
              <InputMask
                ref={phoneRef}
                name="personal_phone"
                type="cel-phone"
                editable={!loading}
                keyboardType="numeric"
                returnKeyType="next"
              />

              <WhatsAppCheckButton onPress={handlePersonalPhoneWhatsAppCheck}>
                <FeatherIcons
                  name={isPersonalPhoneWhatsApp ? 'check-square' : 'square'}
                  size={RFValue(25)}
                  color={
                    isPersonalPhoneWhatsApp
                      ? theme.colors['primary-color']
                      : theme.colors['gray-color']
                  }
                />

                <WhatsAppCheckButtonText>{`What's app`}</WhatsAppCheckButtonText>
              </WhatsAppCheckButton>
            </BoxPhoneWhatsApp>

            <Label>DDD + telefone (visível ao público)</Label>
            <BoxPhoneWhatsApp>
              <InputMask
                ref={phoneRef}
                name="public_phone"
                type="cel-phone"
                editable={!loading}
                keyboardType="numeric"
                returnKeyType="next"
              />

              <WhatsAppCheckButton onPress={handlePublicPhoneWhatsAppCheck}>
                <FeatherIcons
                  name={isPublicPhoneWhatsApp ? 'check-square' : 'square'}
                  size={RFValue(25)}
                  color={
                    isPublicPhoneWhatsApp
                      ? theme.colors['primary-color']
                      : theme.colors['gray-color']
                  }
                />

                <WhatsAppCheckButtonText>{`What's app`}</WhatsAppCheckButtonText>
              </WhatsAppCheckButton>
            </BoxPhoneWhatsApp>

            <BoxPostalCode>
              <InputMask
                ref={postalCodeRef}
                name="postal_code"
                label="CEP"
                type="zip-code"
                editable={!loading}
                value={searchPostalCode}
                onChangeText={(value) => {
                  setSearchPostalCode(value);
                }}
                returnKeyType="next"
              />

              <SearchPostalCodeButton onPress={handleSearchAddressByPostalCode}>
                <FeatherIcons
                  name="search"
                  size={25}
                  color={theme.colors['white-color']}
                />
              </SearchPostalCodeButton>
            </BoxPostalCode>

            <Input
              ref={streetNameRef}
              name="street_name"
              label="Endereço"
              autoCorrect={false}
              editable={!loading}
              returnKeyType="next"
            />

            <Input
              ref={streetNumberRef}
              name="street_number"
              label="Número"
              editable={!loading}
              returnKeyType="next"
            />

            <Input
              ref={neighborhoodRef}
              name="neighborhood"
              label="Bairro"
              editable={!loading}
              returnKeyType="next"
            />

            <Input
              ref={complementRef}
              name="complement"
              label="Complemento"
              editable={!loading}
              returnKeyType="next"
            />

            <Input
              ref={referenceRef}
              name="reference"
              label="Ponto de referência"
              editable={!loading}
              returnKeyType="next"
            />

            <BoxState>
              <Label>Estado</Label>

              <RNPickerSelect
                placeholder={{
                  label: 'Selecione um estado',
                  value: '',
                }}
                useNativeAndroidPickerStyle={false}
                disabled={loading}
                items={loadUF()}
                onValueChange={(value) => handleSelectedUF(value)}
                value={selectedUF}
                Icon={() => {
                  return chevronIconSelectPicker;
                }}
                style={{
                  placeholder: {
                    color: theme.colors['black-color'],
                  },
                  iconContainer: {
                    top: 13,
                    right: 3,
                  },
                  inputIOS: {
                    height: 50,

                    fontSize: 16,
                    color: theme.colors['black-color'],

                    paddingVertical: 10,
                    paddingHorizontal: 23,

                    borderWidth: 2,
                    borderColor: theme.colors['gray-light-color'],
                    borderRadius: 8,

                    paddingRight: 30, // to ensure the text is never behind the icon

                    backgroundColor: theme.colors['white-color'],
                  },
                  inputAndroid: {
                    width: '100%',
                    height: 50,

                    fontSize: 16,
                    color: theme.colors['black-color'],

                    paddingHorizontal: 23,
                    paddingVertical: 8,

                    borderWidth: 2,
                    borderColor: theme.colors['gray-light-color'],
                    borderRadius: 8,

                    paddingRight: 30, // to ensure the text is never behind the icon

                    backgroundColor: theme.colors['white-color'],
                  },
                }}
              />
            </BoxState>

            <BoxCity>
              <Label>Cidade</Label>

              <RNPickerSelect
                placeholder={{
                  label: 'Selecione uma cidade',
                  value: '',
                }}
                useNativeAndroidPickerStyle={false}
                disabled={citiesSelectPicker.length === 0 || loading}
                items={citiesSelectPicker}
                onValueChange={(value) => setSelectedCity(value)}
                value={selectedCity}
                Icon={() => {
                  return chevronIconSelectPicker;
                }}
                style={{
                  placeholder: {
                    color: theme.colors['black-color'],
                  },
                  iconContainer: {
                    top: 13,
                    right: 3,
                  },
                  inputIOS: {
                    height: 50,

                    fontSize: 16,
                    color: theme.colors['black-color'],

                    paddingVertical: 10,
                    paddingHorizontal: 23,

                    borderWidth: 2,
                    borderColor: theme.colors['gray-light-color'],
                    borderRadius: 8,

                    paddingRight: 30, // to ensure the text is never behind the icon

                    backgroundColor: theme.colors['white-color'],
                  },
                  inputAndroid: {
                    width: '100%',
                    height: 50,

                    fontSize: 16,
                    color: theme.colors['black-color'],

                    paddingHorizontal: 23,
                    paddingVertical: 8,

                    borderWidth: 2,
                    borderColor: theme.colors['gray-light-color'],
                    borderRadius: 8,

                    paddingRight: 30, // to ensure the text is never behind the icon

                    backgroundColor: theme.colors['white-color'],
                  },
                }}
              />
            </BoxCity>

            <Footer>
              <Button
                loading={loading}
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Criar conta
              </Button>
            </Footer>
          </Form>
        </Content>
      </ScrollView>

      {/* TOAST AND MODALS */}
      <ToastMessage />

      <LoadingModal modalVisible={loadingModal} />

      <ChooseTakePhotoModal
        isOpenModal={openTakePhotoTutorModal}
        onCloseModal={handleToggleTakePhotoTutorModal}
        onTakePhotoCamera={handleTakePhoto}
        onTakePhotoGallery={handleTakeGallery}
      />
    </Container>
  );
}
