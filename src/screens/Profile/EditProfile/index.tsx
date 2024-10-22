import { useCallback, useMemo, useRef, useState } from 'react';

import { ScrollView, TextInput } from 'react-native';

import { Feather } from '@expo/vector-icons';

import Toast from 'react-native-toast-message';

import { RFValue } from 'react-native-responsive-fontsize';

import RNPickerSelect from 'react-native-picker-select';

import { z as zod } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { Controller, useForm } from 'react-hook-form';

import { useAuth } from '@hooks/auth';

import { api } from '@libs/api';

import axios, { AxiosError } from 'axios';

import { useTheme } from 'styled-components/native';

import { useMutation, useQuery } from '@tanstack/react-query';

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
  const [citiesSelectPicker, setCitiesSelectPicker] = useState<
    ICitySelectPicker[]
  >([]);
  const [loadingModal, setIsLoadingModal] = useState(false);
  // const [loading, setIsLoading] = useState(false);

  const { tutor, updateTutor } = useAuth();
  const theme = useTheme();

  const nameRef = useRef<TextInput>(null);
  const streetNumberRef = useRef<TextInput>(null);
  const neighborhoodRef = useRef<TextInput>(null);
  const complementRef = useRef<TextInput>(null);
  const referenceRef = useRef<TextInput>(null);

  // FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    watch,
  } = useForm<IEditProfileFormData>({
    resolver: zodResolver(editProfileFormSchema),
  });
  // END FORM

  const postalCode = watch('postal_code');

  // USE QUERY
  const { data: profileData, isLoading: isLoadingProfile } = useQuery<
    ITutorDTO | undefined
  >({
    queryKey: ['editProfileScreen', tutor.id],
    queryFn: async () => {
      try {
        const response = await api.get('/tutors/me');

        const tutorData = response.data.tutor as ITutorDTO;

        // REVIEW - USAR HOOK FORM PARA SETAR OS VALORES
        setIsPersonalPhoneWhatsApp(tutorData.personal_phone_is_whatsapp);
        setIsPublicPhoneWhatsApp(tutorData.public_phone_is_whatsapp);
        setValue('postal_code', tutorData.postal_code);
        setValue('state', tutorData.state);
        setValue('city', tutorData.city);

        return tutorData;
      } catch (err) {
        console.log(err);
      }
    },
  });
  // END USE QUERY

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
      // setValue('state', uf);
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

  const { mutateAsync: editProfileMutate, isPending: isLoadingEditProfile } =
    useMutation({
      mutationFn: async (formSubmitData: IEditProfileFormData) => {
        if (formSubmitData.state === '') {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text2: 'Selecione um estado',
          });

          setError('state', { message: 'Selecione um estado' });

          return;
        }

        if (formSubmitData.city === '') {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text2: 'Selecione uma cidade',
          });

          setError('city', { message: 'Selecione uma cidade' });

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
          state: formSubmitData.state,
          city: formSubmitData.city,
        };

        const response = await api.put('/tutors/update', editData);

        if (response.status === 200) {
          const tutorData = response.data;

          await updateTutor(tutorData);

          Toast.show({
            type: 'success',
            position: 'bottom',
            text2: 'Informações atualizadas com sucesso!',
          });
        }
      },
    });

  const handleFormSubmit = useCallback(
    async (formSubmitData: IEditProfileFormData) => {
      try {
        await editProfileMutate(formSubmitData);
      } catch (err) {
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
    [editProfileMutate],
  );
  // END FUNCTIONS

  return (
    <EditProfileContainer>
      <Header title="Editar perfil" />

      {isLoadingProfile ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <EditProfileContent>
            {profileData && (
              <>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      ref={nameRef}
                      label="Nome"
                      editable={!isLoadingEditProfile}
                      autoCorrect={false}
                      returnKeyType="next"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      error={errors.name?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="cnpj_cpf"
                  render={({ field: { value, onChange } }) => (
                    <InputMask
                      label="CPF"
                      type="cpf"
                      editable={!isLoadingEditProfile}
                      keyboardType="numeric"
                      returnKeyType="next"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      error={errors.cnpj_cpf?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      ref={nameRef}
                      label="E-mail"
                      editable={!isLoadingEditProfile}
                      autoCorrect={false}
                      returnKeyType="next"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      error={errors.email?.message}
                    />
                  )}
                />

                <Label>
                  DDD + telefone (utilizado para entrarmos em contato)
                </Label>
                <BoxPhoneWhatsApp>
                  <Controller
                    control={control}
                    name="personal_phone"
                    render={({ field: { value, onChange } }) => (
                      <InputMask
                        type="cel-phone"
                        editable={!isLoadingEditProfile}
                        keyboardType="numeric"
                        returnKeyType="next"
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                        }}
                        error={errors.personal_phone?.message}
                      />
                    )}
                  />

                  <WhatsAppCheckButton
                    onPress={handlePersonalPhoneWhatsAppCheck}
                  >
                    <Feather
                      name={isPersonalPhoneWhatsApp ? 'check-square' : 'square'}
                      size={RFValue(25)}
                      color={
                        isPersonalPhoneWhatsApp
                          ? theme.COLORS['primary-color']
                          : theme.COLORS.GRAY_500
                      }
                    />

                    <WhatsAppCheckButtonText>{`What's app`}</WhatsAppCheckButtonText>
                  </WhatsAppCheckButton>
                </BoxPhoneWhatsApp>

                <Label>DDD + telefone (visível ao público)</Label>
                <BoxPhoneWhatsApp>
                  <Controller
                    control={control}
                    name="public_phone"
                    render={({ field: { value, onChange } }) => (
                      <InputMask
                        type="cel-phone"
                        editable={!isLoadingEditProfile}
                        keyboardType="numeric"
                        returnKeyType="next"
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                        }}
                        error={errors.public_phone?.message}
                      />
                    )}
                  />

                  <WhatsAppCheckButton onPress={handlePublicPhoneWhatsAppCheck}>
                    <Feather
                      name={isPublicPhoneWhatsApp ? 'check-square' : 'square'}
                      size={RFValue(25)}
                      color={
                        isPublicPhoneWhatsApp
                          ? theme.COLORS['primary-color']
                          : theme.COLORS.GRAY_500
                      }
                    />

                    <WhatsAppCheckButtonText>{`What's app`}</WhatsAppCheckButtonText>
                  </WhatsAppCheckButton>
                </BoxPhoneWhatsApp>

                <BoxPostalCode>
                  <Controller
                    control={control}
                    name="postal_code"
                    render={({ field: { value, onChange } }) => (
                      <InputMask
                        label="CEP"
                        type="zip-code"
                        editable={!isLoadingEditProfile}
                        keyboardType="numeric"
                        returnKeyType="next"
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                        }}
                        error={errors.postal_code?.message}
                      />
                    )}
                  />

                  <SearchPostalCodeButton
                    onPress={handleSearchAddressByPostalCode}
                  >
                    <Feather
                      name="search"
                      size={25}
                      color={theme.COLORS.WHITE}
                    />
                  </SearchPostalCodeButton>
                </BoxPostalCode>

                <Controller
                  control={control}
                  name="street_name"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      label="Endereço"
                      editable={!isLoadingEditProfile}
                      autoCorrect={false}
                      returnKeyType="next"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      error={errors.street_name?.message}
                      onSubmitEditing={() => {
                        streetNumberRef.current?.focus();
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="street_number"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      ref={streetNumberRef}
                      label="Número"
                      editable={!isLoadingEditProfile}
                      autoCorrect={false}
                      returnKeyType="next"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      error={errors.street_number?.message}
                      onSubmitEditing={() => {
                        neighborhoodRef.current?.focus();
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="neighborhood"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      ref={neighborhoodRef}
                      label="Bairro"
                      editable={!isLoadingEditProfile}
                      autoCorrect={false}
                      returnKeyType="next"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      error={errors.neighborhood?.message}
                      onSubmitEditing={() => {
                        complementRef.current?.focus();
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="complement"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      ref={complementRef}
                      label="Bairro"
                      editable={!isLoadingEditProfile}
                      autoCorrect={false}
                      returnKeyType="next"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      error={errors.complement?.message}
                      onSubmitEditing={() => {
                        referenceRef.current?.focus();
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="reference"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      ref={referenceRef}
                      label="Ponto de referência"
                      editable={!isLoadingEditProfile}
                      autoCorrect={false}
                      returnKeyType="next"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                      error={errors.reference?.message}
                    />
                  )}
                />

                <BoxState>
                  <Label>Estado</Label>

                  <Controller
                    control={control}
                    name="state"
                    render={({ field: { value, onChange } }) => (
                      <RNPickerSelect
                        placeholder={{
                          label: 'Selecione um estado',
                          value: '',
                        }}
                        useNativeAndroidPickerStyle={false}
                        disabled={isLoadingEditProfile}
                        items={loadUF()}
                        value={value}
                        onValueChange={(value) => {
                          onChange(value);
                          handleSelectedUF(value);
                        }}
                        Icon={() => {
                          return chevronIconSelectPicker;
                        }}
                        style={{
                          placeholder: {
                            color: theme.COLORS.BLACK,
                          },
                          iconContainer: {
                            top: 13,
                            right: 3,
                          },
                          inputIOS: {
                            height: 50,

                            fontSize: 16,
                            color: theme.COLORS.BLACK,

                            paddingVertical: 10,
                            paddingHorizontal: 23,

                            borderWidth: 2,
                            borderColor: theme.COLORS.GRAY_200,
                            borderRadius: 8,

                            paddingRight: 30, // to ensure the text is never behind the icon

                            backgroundColor: theme.COLORS.WHITE,
                          },
                          inputAndroid: {
                            width: '100%',
                            height: 50,

                            fontSize: 16,
                            color: theme.COLORS.BLACK,

                            paddingHorizontal: 23,
                            paddingVertical: 8,

                            borderWidth: 2,
                            borderColor: theme.COLORS.GRAY_200,
                            borderRadius: 8,

                            paddingRight: 30, // to ensure the text is never behind the icon

                            backgroundColor: theme.COLORS.WHITE,
                          },
                        }}
                      />
                    )}
                  />
                </BoxState>

                <BoxCity>
                  <Label>Cidade</Label>

                  <Controller
                    control={control}
                    name="city"
                    render={({ field: { value, onChange } }) => (
                      <RNPickerSelect
                        placeholder={{
                          label: 'Selecione uma cidade',
                          value: '',
                        }}
                        useNativeAndroidPickerStyle={false}
                        disabled={
                          citiesSelectPicker.length === 0 ||
                          isLoadingEditProfile
                        }
                        items={citiesSelectPicker}
                        value={value}
                        onValueChange={(value) => onChange(value)}
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
                            color: theme.COLORS.BLACK,

                            paddingVertical: 10,
                            paddingHorizontal: 23,

                            borderWidth: 2,
                            borderColor: theme.COLORS.GRAY_200,
                            borderRadius: 8,

                            paddingRight: 30, // to ensure the text is never behind the icon

                            backgroundColor: theme.COLORS.WHITE,
                          },
                          inputAndroid: {
                            width: '100%',
                            height: 50,

                            fontSize: 16,
                            color: theme.COLORS.BLACK,

                            paddingHorizontal: 23,
                            paddingVertical: 8,

                            borderWidth: 2,
                            borderColor: theme.COLORS.GRAY_200,
                            borderRadius: 8,

                            paddingRight: 30, // to ensure the text is never behind the icon

                            backgroundColor: theme.COLORS.WHITE,
                          },
                        }}
                      />
                    )}
                  />
                </BoxCity>

                <Footer>
                  <Button
                    loading={isLoadingEditProfile}
                    onPress={handleSubmit(handleFormSubmit)}
                  >
                    Salvar
                  </Button>
                </Footer>
              </>
            )}
          </EditProfileContent>
        </ScrollView>
      )}
    </EditProfileContainer>
  );
}
