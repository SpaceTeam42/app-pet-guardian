import { useCallback, useRef } from 'react';

import { Alert, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@hooks/auth';

import { Controller, useForm } from 'react-hook-form';

import { useMutation } from '@tanstack/react-query';

import { api } from '@libs/api';

import { AxiosError } from 'axios';

import Toast from 'react-native-toast-message';

import { z as zod } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@components/Form/Input';
import { Button } from '@components/Form/Button';
import { Header } from '@components/Header';

import {
  RemoveAccountContainer,
  RemoveAccountContent,
  RemoveAccountMessage,
} from './styles';

const removeAccountFormSchema = zod.object({
  email: zod.string().email('Digite um e-mail válido'),
  password: zod.string(),
});

type IRemoveAccountFormData = zod.infer<typeof removeAccountFormSchema>;

export function RemoveAccountScreen() {
  const { signOut } = useAuth();

  const navigation = useNavigation();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IRemoveAccountFormData>({
    resolver: zodResolver(removeAccountFormSchema),
  });
  // END FORM

  // FUNCTION
  const {
    mutateAsync: removeAccountMutate,
    isPending: isLoadingRemoveAccount,
  } = useMutation({
    mutationFn: async ({ email, password }: IRemoveAccountFormData) => {
      const response = api.delete('/tutors', { data: { email, password } });

      return response;
    },
    onSuccess: async (response) => {
      if (response.status === 204) {
        Alert.alert('Remover conta', 'Sua conta foi removida com sucesso.', [
          {
            text: 'OK',
            style: 'default',
            onPress: async () => {
              await signOut();

              navigation.navigate('homeDrawer');
            },
          },
        ]);
      }
    },
  });

  // const removerAccount = useCallback(
  //   async (formSubmitData: IRemoveAccountFormData) => {
  //     try {
  //       await removeAccountMutate(formSubmitData);
  //     } catch (error) {
  //       Toast.show({
  //         type: 'error',
  //         text2: 'Não foi possível deletar sua conta. Tente novamente!',
  //         position: 'bottom',
  //       });
  //     }
  //   },
  //   [removeAccountMutate],
  // );

  const handleRemoveAccount = useCallback(
    async (formSubmitData: IRemoveAccountFormData) => {
      try {
        Alert.alert(
          'Remover conta',
          `Deseja realmente remover sua conta?${'\n\n'}Isto irá permanentemente deletar sua conta.`,
          [
            {
              text: 'Sim',
              style: 'destructive',
              onPress: async () => {
                await removeAccountMutate(formSubmitData);
              },
            },
            {
              text: 'Não',
              style: 'default',
              onPress: () => null,
            },
          ],
        );
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            if (error.response.status === 400) {
              Toast.show({
                type: 'error',
                position: 'bottom',
                text2: 'Ops! Verifique as informações e tente novamente.',
              });

              return;
            }
          }
        }

        Toast.show({
          type: 'error',
          position: 'bottom',
          text2: 'Não foi possível realizar a operação',
        });
      }
    },
    [removeAccountMutate],
  );
  // END FUNCTION

  return (
    <RemoveAccountContainer>
      <Header title="Remover conta" />

      <RemoveAccountContent>
        <RemoveAccountMessage>
          Informe o e-mail e senha para remover sua conta.{'\n\n'}Lembre-se!
          Essa operação remove sua conta definitivamente
        </RemoveAccountMessage>

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <Input
              ref={emailRef}
              label="E-mail"
              editable={!isLoadingRemoveAccount}
              autoCorrect={false}
              returnKeyType="next"
              value={value}
              onChangeText={(text) => {
                onChange(text);
              }}
              onSubmitEditing={() => {
                passwordRef.current?.focus();
              }}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={() => (
            <Input
              ref={passwordRef}
              label="Senha"
              secureTextFieldEntry
              editable={!isLoadingRemoveAccount}
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={() => {
                handleSubmit(handleRemoveAccount);
              }}
              error={errors.password?.message}
            />
          )}
        />

        <Button
          loading={isLoadingRemoveAccount}
          onPress={handleSubmit(handleRemoveAccount)}
        >
          Remover conta
        </Button>
      </RemoveAccountContent>
    </RemoveAccountContainer>
  );
}
