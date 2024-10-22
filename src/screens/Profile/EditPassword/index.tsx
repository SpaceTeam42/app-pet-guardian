import { useCallback, useRef } from 'react';

import { Alert, ScrollView, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useMutation } from '@tanstack/react-query';

import { api } from '@libs/api';

import { Controller, useForm } from 'react-hook-form';

import { z as zod } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { AxiosError } from 'axios';

import Toast from 'react-native-toast-message';

import { Header } from '@components/Header';
import { Input } from '@components/Form/Input';
import { Button } from '@components/Form/Button';

import { EditPasswordContainer, EditPasswordContent } from './styles';

const editPasswordFormSchema = zod
  .object({
    old_password: zod.string().min(1),
    new_password: zod.string().min(1),
    confirm_password: zod.string().min(1),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'A confirmação da senha não confere.',
    path: ['confirm_password'],
  });

type IEditPasswordFormData = zod.infer<typeof editPasswordFormSchema>;

export const EditPasswordScreen = () => {
  const navigation = useNavigation();

  const oldPasswordRef = useRef<TextInput>(null);
  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  // FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IEditPasswordFormData>({
    resolver: zodResolver(editPasswordFormSchema),
  });
  // END FORM

  // USE MUTATION
  const {
    mutateAsync: changePasswordMutate,
    isPending: isLoadingChangePassword,
  } = useMutation({
    mutationFn: async ({
      old_password,
      new_password,
    }: IEditPasswordFormData) => {
      const data = {
        old_password,
        password: new_password,
      };

      const response = await api.patch('/tutors/update/password', data);

      return response;
    },
    onSuccess: (response) => {
      if (response.status === 204) {
        reset();

        Alert.alert(
          'Atualização de senha',
          'Sua senha foi atualizada com sucesso.',
          [
            {
              text: 'OK',
              style: 'default',
              onPress: () => {
                navigation.navigate('profileScreen');
              },
            },
          ],
        );
      }
    },
  });
  // END USE MUTATION

  const handleChangePassword = useCallback(
    async (formSubmitData: IEditPasswordFormData) => {
      try {
        await changePasswordMutate(formSubmitData);
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

            return;
          }
        }

        Toast.show({
          type: 'error',
          position: 'bottom',
          text2: 'Não foi possível realizar as alterações',
        });
      }
    },
    [changePasswordMutate],
  );

  return (
    <EditPasswordContainer>
      <Header title="Alterar senha" />

      <ScrollView>
        <EditPasswordContent>
          <Controller
            control={control}
            name="old_password"
            render={({ field: { value, onChange } }) => (
              <Input
                ref={oldPasswordRef}
                label="Senha atual"
                secureTextFieldEntry
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                }}
                error={errors.old_password?.message}
                onSubmitEditing={() => {
                  newPasswordRef.current?.focus();
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="new_password"
            render={({ field: { value, onChange } }) => (
              <Input
                ref={newPasswordRef}
                label="Nova senha"
                secureTextFieldEntry
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                }}
                error={errors.new_password?.message}
                onSubmitEditing={() => {
                  confirmPasswordRef.current?.focus();
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { value, onChange } }) => (
              <Input
                ref={newPasswordRef}
                label="Confirme nova senha"
                secureTextFieldEntry
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                }}
                error={errors.new_password?.message}
                onSubmitEditing={handleSubmit(handleChangePassword)}
              />
            )}
          />

          <Button
            loading={isLoadingChangePassword}
            onPress={handleSubmit(handleChangePassword)}
          >
            Alterar
          </Button>
        </EditPasswordContent>
      </ScrollView>
    </EditPasswordContainer>
  );
};
