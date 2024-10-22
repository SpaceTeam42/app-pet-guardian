import { useCallback, useRef } from 'react';

import { Alert, ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { getValidationErrors } from '@utils/getValidationErrors';

import { useMutation } from '@tanstack/react-query';

import { api } from '@services/api';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';

import { AxiosError } from 'axios';

import Toast from 'react-native-toast-message';

import { Header } from '@components/Header';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { EditPasswordContainer, EditPasswordContent } from './styles';

interface IFormSubmitData {
  old_password: string;
  new_password: string;
}

const schemaValidation = Yup.object().shape({
  old_password: Yup.string().required('Informa a atual senha'),
  new_password: Yup.string().required('Informe da nova senha'),
  confirm_password: Yup.string().oneOf(
    [Yup.ref('new_password'), null],
    'A senha de confirmação não é igual a senha digitada',
  ),
});

export const EditPasswordScreen = () => {
  const navigation = useNavigation();

  // FORM
  const formRef = useRef<FormHandles>(null);
  // END FORM

  // USE MUTATION
  const {
    mutateAsync: changePasswordMutate,
    isPending: isLoadingChangePassword,
  } = useMutation({
    mutationFn: async ({ old_password, new_password }: IFormSubmitData) => {
      const data = {
        old_password,
        password: new_password,
      };

      const response = await api.patch('/tutors/update/password', data);

      return response;
    },
    onSuccess: response => {
      if (response.status === 204) {
        formRef.current?.reset();

        Alert.alert(
          'Atualização de senha',
          'Sua senha foi atualizada com sucesso.',
          [
            {
              text: 'OK',
              style: 'default',
              onPress: () => {
                navigation.navigate('ProfileScreen');
              },
            },
          ],
        );
      }
    },
  });
  // END USE MUTATION

  const handleChangePassword = useCallback(
    async (formSubmitData: IFormSubmitData) => {
      try {
        formRef.current?.setErrors({});

        await schemaValidation.validate(formSubmitData, { abortEarly: false });

        await changePasswordMutate(formSubmitData);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

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
    [changePasswordMutate],
  );

  return (
    <EditPasswordContainer>
      <Header title="Alterar senha" />

      <ScrollView>
        <EditPasswordContent>
          <Form ref={formRef} onSubmit={handleChangePassword}>
            <Input
              name="old_password"
              label="Senha atual"
              secureTextFieldEntry
            />

            <Input
              name="new_password"
              label="Nova senha"
              secureTextFieldEntry
            />

            <Input
              name="confirm_password"
              label="Confirme nova senha"
              secureTextFieldEntry
            />

            <Button
              loading={isLoadingChangePassword}
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              Alterar
            </Button>
          </Form>
        </EditPasswordContent>
      </ScrollView>
    </EditPasswordContainer>
  );
};
