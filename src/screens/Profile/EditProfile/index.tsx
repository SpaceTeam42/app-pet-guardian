import { useCallback, useMemo, useRef, useState } from 'react';

import { ScrollView, TextInput } from 'react-native';

import { Feather } from '@expo/vector-icons';

import Toast from 'react-native-toast-message';

import { RFValue } from 'react-native-responsive-fontsize';

import RNPickerSelect from 'react-native-picker-select';

import { z as zod } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

import { useAuth } from '@hooks/auth';

import { api } from '@libs/api';

import axios, { AxiosError } from 'axios';

import { useTheme } from 'styled-components/native';

import { useQuery } from '@tanstack/react-query';

import { ITutorDTO } from 'src/dtos/tutor-dto';

import { loadUF } from '@utils/load-uf';

import { Header } from '@components/Header';
import { Input } from '@components/Form/Input';
import { Button } from '@components/Form/Button';
import { Loading } from '@components/Loading';
import { InputMask } from '@components/Form/InputMask';

import {
  BoxCity,
  BoxPhoneWhatsApp,
  BoxPostalCode,
  BoxState,
  EditProfileContainer,
  EditProfileContent,
  Footer,
  Label,
  SearchPostalCodeButton,
  WhatsAppCheckButton,
  WhatsAppCheckButtonText,
} from './styles';

// type ITutor = {
//   name: string;
//   email: string;
//   cnpj_cpf: string;
//   personal_phone: string;
//   personal_phone_is_whatsapp: boolean;
//   public_phone: boolean;
//   public_phone_is_whatsapp: boolean;
//   street_name: string;
//   street_number: string;
//   complement: string;
//   neighborhood: string;
//   postal_code: string;
//   state: string;
//   city: string;
// };

interface ICity {
  nome: string;
}

interface ICitySelectPicker {
  label: string;
  value: string;
}

interface IResultViaCEP {
  logradouro: string;
  bairro: string;
  uf: string;
  localidade: string;
}

// interface IFormSubmitData {
//   name: string;
//   cnpj_cpf: string;
//   email: string;
//   personal_phone: string;
//   public_phone: string;
//   postal_code: string;
//   street_name: string;
//   street_number: string;
//   complement: string;
//   neighborhood: string;
//   reference: string;
// }

const editProfileFormSchema = zod.object({
  name: zod.string().min(1),
  cnpj_cpf: zod.string().min(1),
  email: zod.string().email('Digite um e-mail válido'),
  personal_phone: zod.string().min(1),
  public_phone: zod.string().min(1),
  postal_code: zod.string(),
  street_name: zod.string().min(1),
  street_number: zod.string().min(1),
  complement: zod.string(),
  neighborhood: zod.string().min(1),
  reference: zod.string(),
  state: zod.string(),
  city: zod.string(),
});

type IEditProfileFormData = zod.infer<typeof editProfileFormSchema>;

export function EditProfileScreen() {
  const [isPersonalPhoneWhatsApp, setIsPersonalPhoneWhatsApp] = useState(false);
  const [isPublicPhoneWhatsApp, setIsPublicPhoneWhatsApp] = useState(false);
  // const [searchPostalCode, setSearchPostalCode] = useState('');
  const [selectedUF, setSelectedUF] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [citiesSelectPicker, setCitiesSelectPicker] = useState<
    ICitySelectPicker[]
  >([]);
  const [loadingModal, setIsLoadingModal] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const { tutor, updateTutor } = useAuth();
  const theme = useTheme();

  const nameRef = useRef<TextInput>(null);

  // FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<IEditProfileFormData>({
    resolver: zodResolver(editProfileFormSchema),
  });
  // END FORM

  const postalCode = watch('postal_code');

  // USEQUERY
  const { data: profileData, isLoading: isLoadingProfile } = useQuery<
    ITutorDTO | undefined
  >({
    queryKey: ['editProfileScreen', tutor.id],
    queryFn: async () => {
      try {
        const response = await api.get('/tutors/me');

        const tutorData = response.data.tutor as ITutorDTO;

        setIsPersonalPhoneWhatsApp(tutorData.personal_phone_is_whatsapp);
        setIsPublicPhoneWhatsApp(tutorData.public_phone_is_whatsapp);
        setSearchPostalCode(tutorData.postal_code);
        setSelectedUF(tutorData.state);
        setSelectedCity(tutorData.city);

        return tutorData;
      } catch (err) {
        console.log(err);
      }
    },
  });
  // END USEQUERY

  // MEMO
  const chevronIconSelectPicker = useMemo(() => {
    return (
      <Feather name="chevron-down" size={25} color={theme.COLORS.GRAY_500} />
    );
  }, [theme.COLORS.GRAY_500]);
  // END MEMO

  // FUNCTIONS
  const handlePersonalPhoneWhatsAppCheck = useCallback(() => {
    setIsPersonalPhoneWhatsApp((oldState) => !oldState);
  }, []);

  const handlePublicPhoneWhatsAppCheck = useCallback(() => {
    setIsPublicPhoneWhatsApp((oldState) => !oldState);
  }, []);

  const handleSearchAddressByPostalCode = useCallback(async () => {
    try {
      const searchPostalCodeCopy = postalCode;

      const postalCodeFormatted = searchPostalCodeCopy.replace(/\D/g, '');

      if (postalCodeFormatted !== '') {
        const validatePostalCodeExpression = /^[0-9]{8}$/;

        if (validatePostalCodeExpression.test(postalCodeFormatted)) {
          setIsLoadingModal(true);

          const result = await axios.get(
            `https://viacep.com.br/ws/${postalCodeFormatted}/json/`,
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
            setValue('state', uf);
            setValue('city', localidade);
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
  }, [postalCode, reset, setValue]);

  const handleSelectedUF = useCallback(
    async (uf: string) => {
      setIsLoadingModal(true);
      setValue('state', uf);
      setValue('city', '');

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
    },
    [setValue],
  );

  const handleFormSubmit = useCallback(
    async (formSubmitData: IEditProfileFormData) => {
      try {
        setIsLoading(true);

        if (formSubmitData.state === '') {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text2: 'Selecione um estados',
          });

          return;
        }

        if (formSubmitData.city === '') {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text2: 'Selecione uma cidade',
          });

          return;
        }

        const editData = {
          id: tutor.id,
          name: formSubmitData.name,
          email: formSubmitData.email,
          type: 'TUTOR',
          cnpj_cpf: formSubmitData.cnpj_cpf,
          personal_phone: formSubmitData.personal_phone,
          personal_phone_is_whatsapp: isPersonalPhoneWhatsApp,
          public_phone: formSubmitData.public_phone,
          public_phone_is_whatasapp: isPublicPhoneWhatsApp,
          street_name: formSubmitData.street_name,
          street_number: formSubmitData.street_number,
          complement:
            formSubmitData.complement !== '' &&
            formSubmitData.complement !== null
              ? formSubmitData.complement
              : 'sem complemento',
          neighborhood: formSubmitData.neighborhood,
          postal_code: formSubmitData.postal_code,
          reference:
            formSubmitData.reference !== '' && formSubmitData.reference !== null
              ? formSubmitData.reference
              : 'sem referência',
          state: selectedUF,
          city: selectedCity,
        };

        const response = await api.put('/tutors/update', editData);

        if (response.status === 200) {
          const tutorData = response.data;

          await updateTutor(tutorData);

          setIsLoading(false);

          Toast.show({
            type: 'success',
            position: 'bottom',
            text2: 'Informações atualizadas com sucesso!',
          });
        }
      } catch (err) {
        setIsLoading(false);

        if (err instanceof AxiosError) {
          if (err.response) {
            if (err.response.status === 400) {
              Toast.show({
                type: 'error',
                position: 'bottom',
                text2: 'Ops! Verifique as informações e tente novamente.',
              });
            }
          }
        }

        Toast.show({
          type: 'error',
          position: 'bottom',
          text2: 'Não foi possível realizar as alterações',
        });
      }
    },
    [
      isPersonalPhoneWhatsApp,
      isPublicPhoneWhatsApp,
      selectedCity,
      selectedUF,
      tutor.id,
      updateTutor,
    ],
  );
  // END FUNCTIONS

  return (
    <EditProfileContainer>
      <Header title="Editar perfil" />

      {isLoadingProfile ? (
        <SimpleLoading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <EditProfileContent>
            {profileData && (
              <Form
                ref={formRef}
                initialData={profileData}
                onSubmit={handleFormSubmit}
              >
                <Input
                  ref={nameRef}
                  name="name"
                  label="Nome"
                  editable={!loading}
                  autoCorrect={false}
                  returnKeyType="next"
                />

                <InputMask
                  name="cnpj_cpf"
                  label="CPF"
                  type="cpf"
                  editable={!loading}
                  keyboardType="numeric"
                  returnKeyType="next"
                />

                <Input
                  name="email"
                  label="E-mail"
                  editable={!loading}
                  autoCorrect={false}
                  returnKeyType="next"
                />

                <Label>
                  DDD + telefone (utilizado para entrarmos em contato)
                </Label>
                <BoxPhoneWhatsApp>
                  <InputMask
                    // ref={phoneRef}
                    name="personal_phone"
                    type="cel-phone"
                    editable={!loading}
                    keyboardType="numeric"
                    returnKeyType="next"
                  />

                  <WhatsAppCheckButton
                    onPress={handlePersonalPhoneWhatsAppCheck}
                  >
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
                    // ref={phoneRef}
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
                    // ref={postalCodeRef}
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

                  <SearchPostalCodeButton
                    onPress={handleSearchAddressByPostalCode}
                  >
                    <FeatherIcons
                      name="search"
                      size={25}
                      color={theme.colors['white-color']}
                    />
                  </SearchPostalCodeButton>
                </BoxPostalCode>

                <Input
                  // ref={streetNameRef}
                  name="street_name"
                  label="Endereço"
                  autoCorrect={false}
                  editable={!loading}
                  returnKeyType="next"
                />

                <Input
                  // ref={streetNumberRef}
                  name="street_number"
                  label="Número"
                  editable={!loading}
                  returnKeyType="next"
                />

                <Input
                  // ref={neighborhoodRef}
                  name="neighborhood"
                  label="Bairro"
                  editable={!loading}
                  returnKeyType="next"
                />

                <Input
                  // ref={complementRef}
                  name="complement"
                  label="Complemento"
                  editable={!loading}
                  returnKeyType="next"
                />

                <Input
                  // ref={referenceRef}
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
                    onPress={() => {
                      formRef.current?.submitForm();
                    }}
                  >
                    Salvar
                  </Button>
                </Footer>
              </Form>
            )}
          </EditProfileContent>
        </ScrollView>
      )}

      {/* TOAST AND DIALOGS */}
      <ToastMessage />
    </EditProfileContainer>
  );
}
