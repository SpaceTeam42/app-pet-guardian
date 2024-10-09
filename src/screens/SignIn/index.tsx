import { useCallback, useRef, useState } from 'react';

import { Platform, ScrollView, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Feather } from '@expo/vector-icons';

import Toast from 'react-native-toast-message';

import { z as zod } from 'zod';

import { Controller, useForm } from 'react-hook-form';

import { useAuth } from '@hooks/auth';

import { useTheme } from 'styled-components/native';

import logoImg from '@assets/logo.jpeg';
import GoogleSvg from '@assets/google.svg';
import AppleSvg from '@assets/apple.svg';
import MailSvg from '@assets/mail.svg';
import UserSvg from '@assets/user.svg';

import { Header } from '@components/Header';
import { SignInButton } from '@components/SignInButton';
import { Input } from '@components/Form/Input';
import { Button } from '@components/Form/Button';

import {
  BoxCreateAccount,
  BoxForm,
  BoxLogo,
  BoxOptionsLogin,
  Container,
  Content,
  DivisorText,
  ForgotPasswordButton,
  ForgotPasswordButtonText,
  FormBackButton,
  LogoImage,
  SignInTitle,
} from './styles';

const signInValidationSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

type IFormDataSubmit = zod.infer<typeof signInValidationSchema>;

export function SignInScreen() {
  const [isSignInByEmail, setIsSignInByEmail] = useState(false);
  // const [loadingByEmail, setLoadingByEmail] = useState(false);

  const theme = useTheme();
  const navigation = useNavigation();

  const { signIn } = useAuth();

  const { control, handleSubmit } = useForm<IFormDataSubmit>();

  // FORM
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  // END FORM

  // FUNCTIONS
  const toggleSignInByEmail = useCallback(() => {
    // formRef.current?.setErrors({});
    setIsSignInByEmail((oldState) => !oldState);
  }, []);

  const handleSignUpNavigation = useCallback(() => {
    navigation.navigate('signUpScreen');
  }, [navigation]);

  const handleSignIn = useCallback(
    async ({ email, password }: IFormDataSubmit) => {
      try {
        /** REVIEW
         * rever qual o próximo passo quando o usuário realizar o login
         * 1 - Se o usuário for direto para a tela de SingIn e realizar o login, voltar para a Home
         * 2 - Mas se o usuário vir para a SignIn pela tela de Adoption, redirecioná-lo para a Adoption
         * com o pet que estava sendo visualizado?
         */
        await signIn({ email, password });
        // setLoadingByEmail(false);

        // NOTE PROVISÓRIO
        navigation.navigate('homeDrawer');
      } catch (err) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Credencial inválida',
          text2: 'Verifique as informações e tente novamente',
        });
      } finally {
        // setLoadingByEmail(false);
      }
    },
    [signIn, navigation],
  );
  // END FUNCTIONS

  return (
    <Container>
      <Header title="Faça o login" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Content>
          <BoxLogo>
            <LogoImage source={logoImg} resizeMode="contain" />
          </BoxLogo>

          <SignInTitle>
            Faça seu login com {'\n'} uma das contas abaixo
          </SignInTitle>

          {!isSignInByEmail && (
            <>
              <BoxOptionsLogin>
                <SignInButton title="Entrar com Google" svg={GoogleSvg} />

                {Platform.OS === 'ios' && (
                  <SignInButton title="Entrar com Apple" svg={AppleSvg} />
                )}

                <SignInButton
                  title="Entrar com e-mail"
                  svg={MailSvg}
                  onPress={toggleSignInByEmail}
                />
              </BoxOptionsLogin>

              <DivisorText>Ou</DivisorText>

              <BoxCreateAccount>
                <SignInButton
                  title="Criar uma conta"
                  svg={UserSvg}
                  onPress={handleSignUpNavigation}
                />
              </BoxCreateAccount>
            </>
          )}

          {isSignInByEmail && (
            <BoxForm>
              <FormBackButton onPress={toggleSignInByEmail}>
                <Feather
                  name="arrow-left"
                  size={30}
                  color={theme.COLORS.BLACK}
                />
              </FormBackButton>

              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                  <Input
                    ref={emailRef}
                    label="E-mail"
                    keyboardType="email-address"
                    autoCorrect={false}
                    returnKeyType="next"
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                    onSubmitEditing={() => {
                      passwordRef.current?.focus();
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                  <Input
                    ref={passwordRef}
                    label="Senha"
                    autoCorrect={false}
                    secureTextFieldEntry
                    returnKeyType="done"
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                    onSubmitEditing={() => {
                      handleSubmit(handleSignIn);
                    }}
                  />
                )}
              />

              <Button
                // loading={loadingByEmail}
                onPress={() => {
                  handleSubmit(handleSignIn);
                }}
              >
                Fazer login
              </Button>

              <ForgotPasswordButton>
                <ForgotPasswordButtonText>
                  Esqueceu a senha?
                </ForgotPasswordButtonText>
              </ForgotPasswordButton>
            </BoxForm>
          )}
        </Content>
      </ScrollView>

      {/* TOAST */}
      {/* <ToastMessage /> */}
    </Container>
  );
}
